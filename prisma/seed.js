import { genSaltSync, hashSync } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { generateUniqueRandomId, randomizeLikeProduct, randomizeReviewProduct } from "../src/utils/index.js";

const saltRounds = 10;
const salt = genSaltSync(saltRounds);
const password_hash = hashSync("rahasia123", salt);

const prisma = new PrismaClient();
const createUserCount = 100;

const categories = [
  { id: 1, name: "Food", slug: "food" },
  { id: 2, name: "Drink", slug: "drink" },
];
const tags = [
  { id: 1, name: "Coffee", slug: "coffee" },
  { id: 2, name: "Tea", slug: "tea" },
  { id: 3, name: "Sushi", slug: "sushi" },
  { id: 4, name: "Milk", slug: "milk" },
  { id: 5, name: "Juice", slug: "juice" },
  { id: 6, name: "Cocktail", slug: "cocktail" },
  { id: 7, name: "Egg", slug: "egg" },
  { id: 8, name: "Salad", slug: "salad" },
  { id: 9, name: "Cheese", slug: "cheese" },
  { id: 10, name: "Fish", slug: "fish" },
  { id: 11, name: "Soup", slug: "soup" },
  { id: 12, name: "Vegetable", slug: "vegetable" },
  { id: 13, name: "Cake", slug: "cake" },
  { id: 14, name: "Mushroom", slug: "mushroom" },
  { id: 15, name: "Pizza", slug: "pizza" },
  { id: 16, name: "Bean", slug: "bean" },
  { id: 17, name: "Yam", slug: "yam" },
  { id: 18, name: "Potato", slug: "potato" },
  { id: 19, name: "Bread", slug: "bread" },
  { id: 20, name: "Pie", slug: "pie" },
  { id: 21, name: "Spaghetti", slug: "spaghetti" },
  { id: 22, name: "Eel", slug: "eel" },
  { id: 23, name: "Pudding", slug: "pudding" },
  { id: 24, name: "Burger", slug: "burger" },
  { id: 25, name: "Ginger", slug: "ginger" },
  { id: 26, name: "Wine", slug: "wine" },
];
const products = [
  {
    name: "Cappuccino",
    slug: "cappuccino",
    price: 10000,
    image: "cappuccino.jpg",
    ingredients: "Coffee, milk.",
    description: "It's cool and refreshing.",
    category: { connect: { id: 2 } },
    tags: {
      create: [{ tag: { connect: { id: 1 } } }, { tag: { connect: { id: 4 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Fried Egg",
    slug: "fried-egg",
    price: 8500,
    image: "fried-egg.jpg",
    ingredients: "Egg.",
    category: { connect: { id: 1 } },
    description: "Sunny-side up.",
    tags: {
      create: [{ tag: { connect: { id: 7 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Omelet",
    slug: "omelet",
    price: 10000,
    image: "omelet.jpg",
    ingredients: "Egg, milk",
    category: { connect: { id: 1 } },
    description: "It's super fluffy.",
    tags: {
      create: [{ tag: { connect: { id: 7 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Salad",
    slug: "salad",
    price: 9500,
    image: "salad.jpg",
    ingredients: "Leek, dandelion, vinegar.",
    category: { connect: { id: 1 } },
    description: "A healthy garden salad.",
    tags: {
      create: [{ tag: { connect: { id: 8 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Cheese Cauliflower",
    slug: "cheese-cauliflower",
    price: 8000,
    image: "cheese-cauliflower.jpg",
    ingredients: "Cauliflower, cheese.",
    category: { connect: { id: 1 } },
    description: "It smells great!",
    tags: {
      create: [{ tag: { connect: { id: 9 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Baked Fish",
    slug: "baked-fish",
    price: 8500,
    image: "baked-fish.jpg",
    ingredients: "Sunfish, bream fish, wheat flour.",
    category: { connect: { id: 1 } },
    description: "Baked fish on a bed of herbs.",
    tags: {
      create: [{ tag: { connect: { id: 10 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Parsnip Soup",
    slug: "parsnip-soup",
    price: 7500,
    image: "parsnip-soup.jpg",
    ingredients: "Parsnip, milk, vinegar.",
    category: { connect: { id: 1 } },
    description: "It's fresh and hearty.",
    tags: {
      create: [{ tag: { connect: { id: 11 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Vegetable Medley",
    slug: "vegetable-medley",
    price: 10000,
    image: "vegetable-medley.jpg",
    ingredients: "Tomato, beet.",
    category: { connect: { id: 1 } },
    description: "This is very nutritious.",
    tags: {
      create: [{ tag: { connect: { id: 12 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Complete Breakfast",
    slug: "complete-breakfast",
    price: 15000,
    image: "complete-breakfast.jpg",
    ingredients: "Fried egg, milk, hashbrowns.",
    category: { connect: { id: 1 } },
    description: "You'll feel ready to take on the world!",
    tags: {
      create: [{ tag: { connect: { id: 7 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Fried Calamari",
    slug: "fried-calamari",
    price: 12000,
    image: "fried-calamari.jpg",
    ingredients: "Squid, wheat flour, oil.",
    category: { connect: { id: 1 } },
    description: "It's so chewy.",
    tags: {
      create: [{ tag: { connect: { id: 10 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Strange Bun",
    slug: "strange-bun",
    price: 8500,
    image: "strange-bun.jpg",
    ingredients: "Wheat flour, periwinkle, void mayonnaise.",
    category: { connect: { id: 1 } },
    description: "What's inside?",
    tags: {
      create: [{ tag: { connect: { id: 13 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Fried Mushroom",
    slug: "fried-mushroom",
    price: 7500,
    image: "fried-mushroom.jpg",
    ingredients: "Common mushroom, morel, oil.",
    category: { connect: { id: 1 } },
    description: "Earthy and aromatic.",
    tags: {
      create: [{ tag: { connect: { id: 14 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Pizza",
    slug: "pizza",
    price: 9000,
    image: "pizza.jpg",
    ingredients: "Wheat flour, tomato, cheese.",
    category: { connect: { id: 1 } },
    description: "It's popular for all the right reasons.",
    tags: {
      create: [{ tag: { connect: { id: 15 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Bean Hotpot",
    slug: "bean-hotpot",
    price: 7500,
    image: "bean-hotpot.jpg",
    ingredients: "Green bean.",
    category: { connect: { id: 1 } },
    description: "It sure is healthy.",
    tags: {
      create: [{ tag: { connect: { id: 16 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Glazed Yams",
    slug: "glazed-yams",
    price: 6000,
    image: "glazed-yams.jpg",
    ingredients: "Yam, sugar.",
    category: { connect: { id: 1 } },
    description: "Sweet and satisfying... The sugar gives it a hint of caramel.",
    tags: {
      create: [{ tag: { connect: { id: 17 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Carp Surprise",
    slug: "carp-surprise",
    price: 10000,
    image: "carp-surprise.jpg",
    ingredients: "Carp.",
    category: { connect: { id: 1 } },
    description: "It's bland and oily.",
    tags: {
      create: [{ tag: { connect: { id: 10 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Hashbrowns",
    slug: "hashbrowns",
    price: 8000,
    image: "hashbrowns.jpg",
    ingredients: "Potato, oil.",
    category: { connect: { id: 1 } },
    description: "Crispy and golden-brown!",
    tags: {
      create: [{ tag: { connect: { id: 18 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Pancakes",
    slug: "pancakes",
    price: 7000,
    image: "pancakes.jpg",
    ingredients: "Wheat flour, egg.",
    category: { connect: { id: 1 } },
    description: "A double stack of fluffy, soft pancakes.",
    tags: {
      create: [{ tag: { connect: { id: 13 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Salmon Dinner",
    slug: "salmon-dinner",
    price: 8000,
    image: "salmon-dinner.jpg",
    ingredients: "Salmon, amaranth, kale.",
    category: { connect: { id: 1 } },
    description: "The lemon spritz makes it special.",
    tags: {
      create: [{ tag: { connect: { id: 10 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Fish Taco",
    slug: "fish-taco",
    price: 7500,
    image: "fish-taco.jpg",
    ingredients: "Tuna, tortilla, red cabbage, mayonnaise.",
    category: { connect: { id: 1 } },
    description: "It smells delicious.",
    tags: {
      create: [{ tag: { connect: { id: 10 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Crispy Bass",
    slug: "crispy-bass",
    price: 10000,
    image: "crispy-bass.jpg",
    ingredients: "Largemouth bass, wheat flour, oil.",
    category: { connect: { id: 1 } },
    description: "Wow, the breading is perfect.",
    tags: {
      create: [{ tag: { connect: { id: 10 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Pepper Poppers",
    slug: "pepper-poppers",
    price: 10000,
    image: "pepper-poppers.jpg",
    ingredients: "Hot pepper, cheese.",
    category: { connect: { id: 1 } },
    description: "Spicy breaded peppers filled with cheese.",
    tags: {
      create: [{ tag: { connect: { id: 9 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Bread",
    slug: "bread",
    price: 5000,
    image: "bread.jpg",
    ingredients: "Wheat flour.",
    category: { connect: { id: 1 } },
    description: "A crusty baguette.",
    tags: {
      create: [{ tag: { connect: { id: 19 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Tom Kha Soup",
    slug: "tom-kha-soup",
    price: 12000,
    image: "tom-kha-soup.jpg",
    ingredients: "Coconut, shrimp, common mushroom.",
    category: { connect: { id: 1 } },
    description: "These flavors are incredible!",
    tags: {
      create: [{ tag: { connect: { id: 11 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Chocolate Cake",
    slug: "chocolate-cake",
    price: 15000,
    image: "chocolate-cake.jpg",
    ingredients: "Wheat flour, egg, sugar, cocoa powder.",
    category: { connect: { id: 1 } },
    description: "Rich and moist with a thick fudge icing.",
    tags: {
      create: [{ tag: { connect: { id: 13 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Pink Cake",
    slug: "pink-cake",
    price: 15000,
    image: "pink-cake.jpg",
    ingredients: "Melon, wheat flour, sugar, egg.",
    category: { connect: { id: 1 } },
    description: "There's little heart candies on top.",
    tags: {
      create: [{ tag: { connect: { id: 13 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Rhubarb Pie",
    slug: "rhubarb-pie",
    price: 12000,
    image: "rhubarb-pie.jpg",
    ingredients: "Rhubarb, wheat flour, sugar.",
    category: { connect: { id: 1 } },
    description: "Mmm, tangy and sweet!",
    tags: {
      create: [{ tag: { connect: { id: 20 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Cookie",
    slug: "cookie",
    price: 6000,
    image: "cookie.jpg",
    ingredients: "Wheat flour, sugar, egg.",
    category: { connect: { id: 1 } },
    description: "Very chewy.",
    tags: {
      create: [{ tag: { connect: { id: 13 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Spaghetti",
    slug: "spaghetti",
    price: 10000,
    image: "spaghetti.jpg",
    ingredients: "Wheat flour, tomato.",
    category: { connect: { id: 1 } },
    description: "An old favorite.",
    tags: {
      create: [{ tag: { connect: { id: 21 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Fried Eel",
    slug: "fried-eel",
    price: 11000,
    image: "fried-eel.jpg",
    ingredients: "Ell, oil.",
    category: { connect: { id: 1 } },
    description: "Greasy but flavorful.",
    tags: {
      create: [{ tag: { connect: { id: 22 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Spicy Eel",
    slug: "spicy-eel",
    price: 11000,
    image: "spicy-eel.jpg",
    ingredients: "Eel, hot pepper, oil.",
    category: { connect: { id: 1 } },
    description: "It's really spicy! Be careful.",
    tags: {
      create: [{ tag: { connect: { id: 22 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Red Plate",
    slug: "red-plate",
    price: 10000,
    image: "red-plate.jpg",
    ingredients: "Red cabbage, radish.",
    category: { connect: { id: 1 } },
    description: "Full of antioxidants.",
    tags: {
      create: [{ tag: { connect: { id: 12 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Eggplant Parmesan",
    slug: "eggplant-parmesan",
    price: 10000,
    image: "eggplant-parmesan.jpg",
    ingredients: "Eggplant, tomato.",
    category: { connect: { id: 1 } },
    description: "Tangy, cheesy, and wonderful.",
    tags: {
      create: [{ tag: { connect: { id: 12 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Rice Pudding",
    slug: "rice-pudding",
    price: 8000,
    image: "rice-pudding.jpg",
    ingredients: "Milk, sugar, rice.",
    category: { connect: { id: 1 } },
    description: "It's creamy, sweet, and fun to eat.",
    tags: {
      create: [{ tag: { connect: { id: 23 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Survival Burger",
    slug: "survival-burger",
    price: 10000,
    image: "survival-burger.jpg",
    ingredients: "Bread, cave carrot, eggplant.",
    category: { connect: { id: 1 } },
    description: "A convenient snack for the explorer.",
    tags: {
      create: [{ tag: { connect: { id: 24 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Pumpkin Soup",
    slug: "pumpkin-soup",
    price: 10000,
    image: "pumpkin-soup.jpg",
    ingredients: "Pumpkin, milk.",
    category: { connect: { id: 1 } },
    description: "A seasonal favorite.",
    tags: {
      create: [{ tag: { connect: { id: 11 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Trout Soup",
    slug: "trout-soup",
    price: 10000,
    image: "trout-soup.jpg",
    ingredients: "Rainbow trout, green algae.",
    category: { connect: { id: 1 } },
    description: "Pretty salty.",
    tags: {
      create: [{ tag: { connect: { id: 11 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Algae Soup",
    slug: "algae-soup",
    price: 8000,
    image: "algae-soup.jpg",
    ingredients: "Green algae.",
    category: { connect: { id: 1 } },
    description: "It's a little slimy.",
    tags: {
      create: [{ tag: { connect: { id: 11 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Plum Pudding",
    slug: "plum-pudding",
    price: 7500,
    image: "plum-pudding.jpg",
    ingredients: "Wild plum, wheat flour, sugar.",
    category: { connect: { id: 1 } },
    description: "A traditional holiday treat.",
    tags: {
      create: [{ tag: { connect: { id: 23 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Pumpkin Pie",
    slug: "pumpkin-pie",
    price: 7000,
    image: "pumpkin-pie.jpg",
    ingredients: "",
    category: { connect: { id: 1 } },
    description: "Silky pumpkin cream in a flakey crust.",
    tags: {
      create: [{ tag: { connect: { id: 20 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Radish Salad",
    slug: "radish-salad",
    price: 8500,
    image: "radish-salad.jpg",
    ingredients: "Oil, vinegar, radish.",
    category: { connect: { id: 1 } },
    description: "The radishes are so crisp!",
    tags: {
      create: [{ tag: { connect: { id: 8 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Seafoam Pudding",
    slug: "seafoam-pudding",
    price: 8000,
    image: "seafoam-pudding.jpg",
    ingredients: "Flounder, midnight carp, squid ink.",
    category: { connect: { id: 1 } },
    description: "This briny pudding will really get you into the maritime mindset!",
    tags: {
      create: [{ tag: { connect: { id: 23 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Fruit Salad",
    slug: "fruit-salad",
    price: 10000,
    image: "fruit-salad.jpg",
    ingredients: "Blueberry, melon, apricot.",
    category: { connect: { id: 1 } },
    description: "A delicious combination of summer fruits.",
    tags: {
      create: [{ tag: { connect: { id: 8 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Fiddlehead Risotto",
    slug: "fiddlehead-risotto",
    price: 10000,
    image: "fiddlehead-risotto.jpg",
    ingredients: "Oil, fiddlehead fern, garlic.",
    category: { connect: { id: 1 } },
    description: "A creamy rice dish served with sauteed fern heads. It's a little bland.",
    tags: {
      create: [{ tag: { connect: { id: 12 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Triple Shot Espresso",
    slug: "triple-shot-espresso",
    price: 4500,
    image: "triple-shot-espresso.jpg",
    ingredients: "Coffee",
    category: { connect: { id: 2 } },
    description: "It's more potent than regular coffee!",
    tags: {
      create: [{ tag: { connect: { id: 1 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Shrimp Cocktail",
    slug: "shrimp-cocktail",
    price: 5000,
    image: "shrimp-cocktail.jpg",
    ingredients: "Tomato, shrimp, wild horseradish.",
    category: { connect: { id: 2 } },
    description: "A sumptuous appetizer made with freshly-caught shrimp.",
    tags: {
      create: [{ tag: { connect: { id: 6 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Ginger Ale",
    slug: "ginger-ale",
    price: 5000,
    image: "ginger-ale.jpg",
    ingredients: "Ginger, sugar.",
    category: { connect: { id: 2 } },
    description: "A zesty soda known for its soothing effect on the stomach.",
    tags: {
      create: [{ tag: { connect: { id: 25 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
  {
    name: "Wine",
    slug: "wine",
    price: 15000,
    image: "wine.jpg",
    ingredients: "Grape.",
    category: { connect: { id: 2 } },
    description: "Drink in moderation.",
    tags: {
      create: [{ tag: { connect: { id: 26 } } }],
    },
    likes: {
      create: randomizeLikeProduct(createUserCount),
    },
    reviews: {
      create: randomizeReviewProduct(createUserCount),
    },
  },
];
const users = [
  {
    id: 2,
    email: "sabil@dev.com",
    phoneNumber: "0898-7654-3210",
    name: "Sabilillah",
    password: password_hash,
    avatar: faker.internet.avatar(),
  },
];

for (let index = 3; index <= createUserCount; index++) {
  users.push({
    id: index,
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    name: faker.name.fullName(),
    password: password_hash,
    avatar: faker.internet.avatar(),
  });
}

async function main() {
  const categoryCount = await prisma.category.createMany({ data: categories });
  const tagCount = await prisma.tag.createMany({ data: tags });

  await prisma.user.create({
    data: {
      id: 1,
      email: "zylcom@dev.com",
      phoneNumber: "0812-3456-7890",
      name: "Zylcom",
      password: password_hash,
      avatar: faker.internet.avatar(),
      cart: { create: { id: 1 } },
    },
    include: { cart: { include: { cartItems: true } } },
  });
  users.forEach(async (user) => {
    const result = await prisma.user.create({ data: { ...user, cart: { create: {} } }, include: { cart: { include: { cartItems: true } } } });

    console.log(result);
  });

  Promise.all([categoryCount, tagCount])
    .then(async (values) => {
      console.log(values);

      return await Promise.all(
        products.map(async (product) => {
          return await prisma.product.create({
            data: {
              name: product.name,
              slug: product.slug,
              image: product.image,
              price: product.price,
              ingredients: product.ingredients,
              description: product.description,
              category: product.category,
              tags: product.tags,
              reviews: product.reviews,
              likes: product.likes,
            },
          });
        })
      );
    })
    .then(async (result) => {
      console.log(result);

      for (let index = 0; index < Math.floor(Math.random() * 48); index++) {
        const randomUniqueID = generateUniqueRandomId(48);
        const result = await prisma.cartItem.upsert({
          update: { cart: { connect: { id: 1 } }, product: { connect: { id: randomUniqueID } }, quantity: Math.floor(Math.random() * 999) },
          create: { cart: { connect: { id: 1 } }, product: { connect: { id: randomUniqueID } }, quantity: Math.floor(Math.random() * 999) },
          where: { productItem: { productId: randomUniqueID, cartId: 1 } },
          include: { cart: { include: { cartItems: true } } },
        });

        console.log(result);
      }
      console.log("Successfully seeded database. Closing connection.");
    });
}

main()
  .catch(async (e) => {
    console.error(`There was an error while seeding: ${e}`);

    await prisma.$disconnect();

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
