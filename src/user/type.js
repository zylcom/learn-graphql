const userType = `#graphql
  type User {
    id: ID!
    email: String!
    phoneNumber: String!
    name: String!
    avatar: String
    cart: Cart
    createdAt: Datetime
    updatedAt: Datetime
  }

  type UserAuth {
    data: User
    token: String
  }

  type CartItem {
    id: ID!
    product: Product!
    cartId: ID!
    productId: ID!
    quantity: Int!
    createdAt: Datetime
    updatedAt: Datetime
  }

  type Cart {
    id: ID!
    cartItems: [CartItem]
    user: User
    userId: ID!
    totalPrice: Int
    createdAt: Datetime
    updatedAt: Datetime
  }

  type UserError implements BaseError {
    message: String!
  }

  type CreateUserFailed implements BaseError {
    message: String!
  }

  type AuthFailed implements BaseError {
    message: String!
  }

  type CartError implements BaseError {
    message: String!
  }

  union UserResult = User | UserError
  union RegisterUserResult = UserAuth | CreateUserFailed
  union AuthPayload = UserAuth | AuthFailed
  union MyCartResult = Cart | CartError

  type Query {
    getUser(userId: Int!): UserResult
    getMyCart: MyCartResult
    getMyProfile: UserResult
    authenticate(email: String!, password: String!): AuthPayload
  }

  type Mutation {
    registerUser(email: String!, name: String!, phoneNumber: String!, password: String!, avatar:String, countryCode: String!): RegisterUserResult
    updateMyCart(productId: Int!, quantity: Int!): MyCartResult
    deleteCartItemById(cartItemId: Int!): MyCartResult
  }
`;

export default userType;
