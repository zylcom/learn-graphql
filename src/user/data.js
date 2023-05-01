import isEmail from "validator/lib/isEmail.js";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import { verifyToken, calculateTotalPrice } from "../utils/index.js";

const prisma = new PrismaClient({ errorFormat: "minimal" });
const SECRET_KEY = process.env.SECRET_KEY;

async function getUser(_, { userId }) {
  const result = await prisma.user.findUnique({ where: { id: userId } }).then((user) => {
    if (!user) {
      return { __typename: "UserError", message: "User not found" };
    }

    return { __typename: "User", ...user };
  });

  return result;
}

async function getMyCart(_, {}, context) {
  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "CartError", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id } });

  if (!user) {
    return { __typename: "CartError", message: "Unauthorized!" };
  }

  try {
    const cart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { cartItems: { include: { product: true } } } }).then((result) => {
      const totalPrice = calculateTotalPrice(result.cartItems);

      result.totalPrice = totalPrice;

      return result;
    });

    return { __typename: "Cart", ...cart };
  } catch (error) {
    return { __typename: "CartError", message: error.message };
  }
}

async function updateMyCart(_, { productId, quantity }, context) {
  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "CartError", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id }, include: { cart: true } });

  if (!user) {
    return { __typename: "CartError", message: "Unauthorized!" };
  }

  try {
    const newCart = await prisma.cartItem
      .upsert({
        update: { cart: { connect: { id: user.cart.id } }, product: { connect: { id: productId } }, quantity },
        create: { cart: { connect: { id: user.cart.id } }, product: { connect: { id: productId } }, quantity },
        where: { productItem: { productId, cartId: user.cart.id } },
        include: { cart: { include: { cartItems: { include: { product: true } } } } },
      })
      .then((result) => {
        const totalPrice = calculateTotalPrice(result.cart.cartItems);

        result.cart.totalPrice = totalPrice;

        return result.cart;
      });

    return { __typename: "Cart", ...newCart };
  } catch (error) {
    return { __typename: "CartError", message: error.message };
  }
}

async function getMyProfile(_, {}, context) {
  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "UserError", message: decodedToken.error.message };
  }

  const result = await prisma.user
    .findUnique({ where: { id: decodedToken.data.id }, include: { cart: { include: { cartItems: { include: { product: true } } } } } })
    .then((user) => {
      if (!user) {
        return { __typename: "UserError", message: "User not found" };
      }

      const totalPrice = calculateTotalPrice(user.cart.cartItems);

      user.cart.totalPrice = totalPrice;

      return { __typename: "User", ...user };
    });

  return result;
}

async function registerUser(_, { email, name, phoneNumber, password, confirmationPassword, avatar = "default.jpg", countryCode }) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const password_hash = hashSync(password, salt);

  try {
    if (email === "" || phoneNumber === "") {
      throw new Error("Email or Phone Number is required!");
    }

    if (!isValidPhoneNumber(phoneNumber, countryCode)) {
      throw new Error("Phone number is invalid!");
    }

    if (!isEmail(email)) {
      throw new Error("Email is invalid!");
    }

    if (password !== confirmationPassword) {
      throw new Error("Password and confirmation password are not match!");
    }

    if (confirmationPassword.length < 8) {
      throw new Error("Password length must 8 or above!");
    }

    const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryCode);
    const formattedPhoneNumber = parsedPhoneNumber.formatInternational();

    const result = await prisma.user
      .create({
        data: { email, name, phoneNumber: formattedPhoneNumber, password: password_hash, avatar, cart: { create: {} } },
        include: { cart: { include: { cartItems: true } } },
      })
      .then((user) => {
        const totalPrice = calculateTotalPrice(user.cart.cartItems);
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "30m" });

        user.cart.totalPrice = totalPrice;

        return { __typename: "UserAuth", data: { ...user }, token };
      });

    return result;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && error.meta.target === "User_email_key") {
        return { __typename: "CreateUserFailed", message: `Email ${email} already in use!` };
      } else if (error.code === "P2002" && error.meta.target === "User_phoneNumber_key") {
        return { __typename: "CreateUserFailed", message: `Phone Number ${phoneNumber} already in use!` };
      }
    }

    return { __typename: "CreateUserFailed", message: error.message };
  }
}

async function authenticate(_, { email, password }) {
  try {
    if (email === "") {
      throw new Error("Email is required!");
    }

    if (!isEmail(email)) {
      throw new Error("Email is invalid!");
    }

    const result = await prisma.user
      .findUnique({ where: { email }, include: { cart: { include: { cartItems: { include: { product: true } } } } } })
      .then(async (user) => {
        if (!user) {
          throw new Error("User not found!");
        }

        const isValidPassword = compareSync(password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        const totalPrice = calculateTotalPrice(user.cart.cartItems);

        user.cart.totalPrice = totalPrice;

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "30m" });

        return { __typename: "UserAuth", data: { ...user }, token };
      });

    return result;
  } catch (error) {
    return { __typename: "AuthFailed", message: error.message };
  }
}

async function deleteCartItemById(_, { cartItemId }, context) {
  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "CartError", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id }, include: { cart: true } });

  if (!user) {
    return { __typename: "CartError", message: "Unauthorized!" };
  }

  try {
    const newCart = await prisma.cartItem.delete({ where: { id: cartItemId } }).then(async (result) => {
      if (!result) {
        return { __typename: "CartError", message: "Cart item is not found" };
      }
      const cart = await prisma.cart.findUnique({ where: { id: result.cartId }, include: { cartItems: { include: { product: true } } } });

      const totalPrice = calculateTotalPrice(cart.cartItems);

      cart.totalPrice = totalPrice;

      return cart;
    });

    return { __typename: "Cart", ...newCart };
  } catch (error) {
    return { __typename: "CartError", message: error.message };
  }
}

export default { getUser, getMyCart, getMyProfile, registerUser, updateMyCart, authenticate, deleteCartItemById };
