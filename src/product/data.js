import { PrismaClient, Prisma } from "@prisma/client";
import { calculateTotalPrice, verifyToken } from "../utils/index.js";

const prisma = new PrismaClient({ errorFormat: "minimal" });

async function getAllProductCategory() {
  const categoryList = await prisma.category.findMany();

  if (categoryList.length < 1) {
    return { __typename: "CategoryNotFound", message: "Categories is empty!" };
  }

  return { __typename: "CategoryList", categories: [...categoryList] };
}

async function getAllProductTag() {
  const tags = await prisma.tag.findMany();

  if (tags.length < 1) {
    return { __typename: "TagNotFound", message: "Tags is empty!" };
  }

  return { __typename: "TagList", tags };
}

async function getFilteredProducts(_, { take, category = "", tag = "", cursor, keyword = "" }) {
  const products = await prisma.product.findMany({
    take: take ? take : undefined,
    skip: cursor === undefined ? 0 : 1,
    cursor,
    where: {
      name: { contains: keyword },
      category: { slug: { contains: category } },
      tags: { some: { tag: { slug: { contains: tag } } } },
    },
    include: { likes: { select: { userId: true } } },
    orderBy: { id: "asc" },
  });

  if (products.length < 1) {
    return { __typename: "ProductError", message: "Products is empty!" };
  }

  const edges = await Promise.all(
    products.map(async (node) => {
      const likedBy = node.likes.map((like) => like.userId);
      const rating = await prisma.review.aggregate({ _avg: { rating: true }, where: { productId: node.id } });

      return { node: { ...node, likedBy, averageRating: rating._avg.rating }, cursor: node.id };
    })
  );
  const endCursor = edges[edges.length - 1].node.id;
  const hasNextPage = await prisma.product
    .findMany({
      take,
      skip: 1,
      cursor: { id: endCursor },
      where: {
        name: { contains: keyword },
        category: { slug: { contains: category } },
        tags: { some: { tag: { slug: { contains: tag } } } },
      },
    })
    .then((result) => (result.length > 0 ? true : false));

  return {
    __typename: "ProductList",
    edges,
    pageInfo: { endCursor, hasNextPage },
  };
}

async function getBestRatedProducts(_, { category = "food" }) {
  const bestRatedProducts = await prisma.$queryRaw(
    Prisma.sql`
      SELECT p.*, IFNULL(l.likesCount, 0) AS likesCount, IFNULL(r.averageRating, 0) AS averageRating
      FROM Product p
      LEFT JOIN (
        SELECT productId, CAST(COUNT(*) AS CHAR(32)) AS likesCount
        FROM ProductLikes
        GROUP BY productId
      ) l ON p.id = l.productId
      LEFT JOIN (
        SELECT productId, CAST(AVG(rating) AS CHAR(32)) AS averageRating
        FROM Review
        GROUP BY productId
      ) r ON p.id = r.productId
      WHERE categoryId IN (
        SELECT id
        FROM Category
        WHERE slug=${category}
      )
      HAVING averageRating >= 3
      ORDER BY averageRating DESC, likesCount DESC
      LIMIT 10
    `
  );

  if (bestRatedProducts.length < 1) {
    return { __typename: "ProductError", message: "Products not found" };
  }

  return { __typename: "BestRatedProductList", products: bestRatedProducts };
}

async function getProduct(_, { slug }) {
  const result = await prisma.product
    .findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
        reviews: { include: { user: true } },
        likes: { select: { userId: true } },
      },
    })
    .then(async (product) => {
      if (!product) {
        return { __typename: "ProductError", message: "Product not found!" };
      }

      const likedBy = product.likes.map((like) => like.userId);

      const rating = await prisma.review.aggregate({ _avg: { rating: true }, where: { productId: product.id } });

      const tags = await prisma.tag.findMany({
        where: {
          products: {
            some: {
              product: { slug },
            },
          },
        },
      });

      product.tags = tags;

      return {
        __typename: "Product",
        averageRating: rating._avg.rating,
        likedBy,
        ...product,
      };
    })
    .catch((error) => {
      console.error(error);
    });

  return result;
}

async function getTagsByCategory(_, { category }) {
  const tags = await prisma.tag.findMany({
    where: {
      products: { some: { product: { category: { slug: category } } } },
    },
  });

  if (tags.length < 1) {
    return { __typename: "TagNotFound", message: "Tags is empty!" };
  }

  return { __typename: "TagList", tags };
}

async function getProductReviews(_, { productId }) {
  const reviews = await prisma.review.findMany({ where: { productId }, include: { user: true } }).then((reviews) => {
    return { __typename: "ReviewList", reviews: reviews };
  });

  return reviews;
}

async function createReview(_, { productId, description, rating }, context) {
  if (rating < 1 || rating > 5) {
    return { __typename: "FailCreateReview", message: "Rating value must greater than 0 and less than 5" };
  }

  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "FailCreateReview", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id } });

  if (!user) {
    return { __typename: "FailCreateReview", message: "Unauthorized!" };
  }

  try {
    const review = await prisma.review.create({
      data: {
        description,
        rating,
        product: { connect: { id: productId } },
        user: { connect: { id: user.id } },
      },
      include: { user: true, product: true },
    });

    return { __typename: "Review", ...review };
  } catch (error) {
    return { __typename: "FailCreateReview", message: error.message };
  }
}

async function updateReview(_, { description, rating, productId }, context) {
  if (rating < 1 || rating > 5) {
    return { __typename: "FailUpdateReview", message: "Rating value must greater than 0 and less than 5" };
  }

  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "FailUpdateReview", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id } });

  if (!user) {
    return { __typename: "FailUpdateReview", message: "Unauthorized!" };
  }

  try {
    const review = await prisma.review.update({
      where: { review: { productId, userId: user.id } },
      data: { description, rating },
      include: { user: true, product: true },
    });

    return { __typename: "Review", ...review };
  } catch (error) {
    console.log(error);
    return { __typename: "FailUpdateReview", message: error.message };
  }
}

async function likeProduct(_, { productId }, context) {
  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "FailLikeProduct", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id } });

  if (!user) {
    return { __typename: "FailLikeProduct", message: "Unauthorized!" };
  }

  try {
    const result = await prisma.productLikes.create({ data: { product: { connect: { id: productId } }, user: { connect: { id: user.id } } } });

    return { __typename: "Like", ...result };
  } catch (error) {
    switch (error.code) {
      case "P2002":
        return { __typename: "FailLikeProduct", message: `Product with id "${productId}" has been liked` };

      case "P2025":
        return { __typename: "FailLikeProduct", message: `Product with id "${productId}" not found` };

      default:
        return { __typename: "FailLikeProduct", message: error.message };
    }
  }
}

async function neutralizeLikeProduct(_, { productId }, context) {
  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "FailNeutralizeLikeProduct", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id } });

  if (!user) {
    return { __typename: "FailNeutralizeLikeProduct", message: "Unauthorized!" };
  }

  try {
    const result = await prisma.productLikes.delete({ where: { like: { productId, userId: user.id } } });

    return { __typename: "Like", ...result };
  } catch (error) {
    switch (error.code) {
      case "P2025":
        return { __typename: "FailNeutralizeLikeProduct", message: `Like already removed from product with id "${productId}"` };

      default:
        return { __typename: "FailNeutralizeLikeProduct", message: error.message };
    }
  }
}

async function checkoutOrder(_, {}, context) {
  const decodedToken = verifyToken(context.token);

  if (decodedToken.error) {
    return { __typename: "CheckoutError", message: decodedToken.error.message };
  }

  const user = await prisma.user.findUnique({ where: { id: decodedToken.data.id }, include: { cart: true } });

  if (!user) {
    return { __typename: "CheckoutError", message: "Unauthorized!" };
  }

  try {
    const cartItems = await prisma.cartItem.findMany({ where: { cartId: user.cart.id }, include: { product: true } });

    if (cartItems.length < 1) {
      throw new Error("There no items to checkout.");
    }

    const totalAmount = calculateTotalPrice(cartItems);

    const order = await prisma.orderRecord.create({
      data: {
        status: "success",
        receipt: { create: { totalAmount, user: { connect: { id: user.id } } } },
        user: { connect: { id: user.id } },
        payment: { create: { amount: totalAmount, method: "DANA" } },
        shipment: {
          create: {
            address: "Bojong Raya RT001/004",
            city: "Jakarta Barat",
            state: "DKI Jakarta",
            country: "Indonesia",
            zipCode: "11740",
            user: { connect: { id: user.id } },
          },
        },
        orderItems: {
          createMany: {
            data: cartItems.map((item) => {
              return { productId: item.productId, quantity: item.quantity };
            }),
          },
        },
      },
      include: {
        orderItems: { include: { product: true } },
        shipment: true,
        receipt: true,
      },
    });

    await prisma.cart.update({ where: { id: user.cart.id }, data: { cartItems: { deleteMany: {} } } });

    return { __typename: "Receipt", ...order.receipt, orderItems: order.orderItems };
  } catch (error) {
    return { __typename: "CheckoutError", message: error.message };
  }
}

export default {
  checkoutOrder,
  createReview,
  getAllProductCategory,
  getAllProductTag,
  getFilteredProducts,
  getBestRatedProducts,
  getProduct,
  getProductReviews,
  getTagsByCategory,
  likeProduct,
  neutralizeLikeProduct,
  updateReview,
};
