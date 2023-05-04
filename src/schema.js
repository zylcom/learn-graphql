import userType from "./user/type.js";
import userResolvers from "./user/data.js";
import productType from "./product/type.js";
import productResolvers from "./product/data.js";

const typeDefs = `#graphql
  scalar Datetime

  interface BaseError {
    message: String!
  }

  ${userType}
  ${productType}
`;

const resolvers = {
  Query: {
    getAllProductCategory: productResolvers.getAllProductCategory,
    getFilteredProducts: productResolvers.getFilteredProducts,
    getTagsByCategory: productResolvers.getTagsByCategory,
    getAllProductTag: productResolvers.getAllProductTag,
    getBestRatedProducts: productResolvers.getBestRatedProducts,
    getProduct: productResolvers.getProduct,
    getProductReviews: productResolvers.getProductReviews,
    authenticate: userResolvers.authenticate,
    getMyCart: userResolvers.getMyCart,
    getMyProfile: userResolvers.getMyProfile,
    getUser: userResolvers.getUser,
  },
  Mutation: {
    checkoutOrder: productResolvers.checkoutOrder,
    createReview: productResolvers.createReview,
    likeProduct: productResolvers.likeProduct,
    neutralizeLikeProduct: productResolvers.neutralizeLikeProduct,
    updateReview: productResolvers.updateReview,
    registerUser: userResolvers.registerUser,
    updateMyCart: userResolvers.updateMyCart,
    deleteCartItemById: userResolvers.deleteCartItemById,
  },
};

export { typeDefs, resolvers };
