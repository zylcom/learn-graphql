import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

function calculateTotalPrice(cartItems) {
  return cartItems.reduce((acc, item) => {
    const itemPrice = item.product.price * item.quantity;

    return acc + itemPrice;
  }, 0);
}

function verifyToken(token) {
  return verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      return { error, data: null };
    } else {
      return { error, data: { ...decoded } };
    }
  });
}

export { calculateTotalPrice, verifyToken };
