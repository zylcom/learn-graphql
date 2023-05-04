import { faker } from "@faker-js/faker";
import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;
const generatedId = [];

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

function generateUniqueRandomId(max) {
  let randomId;

  // Keep generating random id until we find one that is unique
  do {
    randomId = Math.floor(Math.random() * max) + 1; // Generate a random id between 1 and 100
  } while (generatedId.includes(randomId)); // Check if the id has been generated before

  // Add the id to the generated id array
  generatedId.push(randomId);

  return randomId;
}

function randomizeLikeProduct(max) {
  const data = [];

  for (let index = 0; index < Math.floor(Math.random() * max); index++) {
    data.push({ user: { connect: { id: generateUniqueRandomId(max) } } });
  }

  generatedId.length = 0;

  return data;
}

function randomizeReviewProduct(max) {
  const data = [];

  for (let index = 0; index < Math.floor(Math.random() * max); index++) {
    data.push({
      description: faker.lorem.sentence(),
      rating: Math.floor(Math.random() * 5) + 1,
      user: { connect: { id: generateUniqueRandomId(max) } },
    });
  }

  generatedId.length = 0;

  return data;
}

export { calculateTotalPrice, verifyToken, generateUniqueRandomId, randomizeLikeProduct, randomizeReviewProduct };
