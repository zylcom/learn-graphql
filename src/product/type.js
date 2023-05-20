const productType = `#graphql
  type Category {
    id: ID!
    name: String!
    slug: String!
    createdAt: Datetime
    updatedAt: Datetime
  }

  type Review {
    id: ID!
    description: String
    rating: Int!
    user: User
    product: Product
    createdAt: Datetime
    updatedAt: Datetime
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    createdAt: Datetime
    updatedAt: Datetime
  }

  type Like {
    id: ID!
    productId: ID!
    userId: ID!
    createdAt: Datetime
    updatedAt: Datetime
  }

  type Product {
    id: ID!
    name: String!
    slug: String!
    price: Int!
    image: String
    categoryId: ID!
    category: Category
    tags: [Tag]
    reviews: [Review]
    likedBy: [ID]
    ingredients: String
    createdAt: Datetime
    updatedAt: Datetime
    averageRating: Float
    likesCount: Int
  }

  type Order {
    id: ID!
    user: User
    amountTotal: Int!
    amountSubtotal: Int!
    orderItems: [Item]!
    status: String!
    receipt: Receipt
    payment: Payment
    shipment: Shipment
    checkoutSession: CheckoutSession
    createdAt: Datetime
    updatedAt: Datetime
  }

  type Shipment {
    id: ID!
    address: String!,
    city: String!, 
    state: String!, 
    country: String!, 
    zipCode: String!, 
    phone: String!, 
    name: String!, 
    detail: String!
    deliverCost: Int!
    order: Order
  }

  type Receipt {
    id: ID!
    orderId: ID!
    order: Order
    orderItems: [Item]!
    createdAt: Datetime
  }

  type Payment {
    id: ID!
    amount: Int!
    method: String!
    status: String!
    order: Order
    createdAt: Datetime
  }

  type CheckoutSession {
    id: ID!
    sessionId: String!
    orderId: ID!
    url: String!
    expiresAt: Datetime
  }

  type Review {
    id: ID!
    description: String
    rating: Int!
    user: User
  }

  type Item {
    id: ID!
    productId: ID!
    product: Product!
    quantity: Int!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }

  type Edge {
    node: Product
    cursor: String
  }

  type ProductList {
    edges: [Edge]
    pageInfo: PageInfo
  }

  type TagList {
    tags: [Tag]!
  }

  type CategoryList {
    categories: [Category]!
  }

  type ReviewList {
    reviews: [Review]
  }

  type BestRatedProductList {
    products: [Product]
  }

  input Cursor {
    id: Int!
  }
  
  type ProductError implements BaseError {
    message: String!
  }

  type TagNotFound implements BaseError {
    message: String!
  }

  type CategoryNotFound implements BaseError {
    message: String!
  }

  type FailCreateReview implements BaseError {
    message: String!
  }

  type FailUpdateReview implements BaseError {
    message: String!
  }

  type FailLikeProduct implements BaseError {
    message: String!
  }

  type FailNeutralizeLikeProduct implements BaseError {
    message: String!
  }

  type CheckoutError implements BaseError {
    message: String!
  }

  type OrderError implements BaseError {
    message: String!
  }

  union BestRatedProductResult = BestRatedProductList | ProductError
  union ProductResult = Product | ProductError
  union ProductListResult = ProductList | ProductError
  union TagListResult = TagList | TagNotFound
  union CategoryListResult = CategoryList | CategoryNotFound
  union CreateReviewResult = Review | FailCreateReview
  union UpdateReviewResult = Review | FailUpdateReview
  union LikeProductResult = Like | FailLikeProduct
  union NeutralizeLikeProductResult = Like | FailNeutralizeLikeProduct
  union CheckoutResult = CheckoutSession | CheckoutError
  union OrderResult = Order | OrderError
  
  type Query {
    getAllProductCategory: CategoryListResult
    getAllProductTag: TagListResult
    getAllReview: ReviewList
    getProductReviews(productId: Int!): ReviewList
    getFilteredProducts(take: Int, category: String!, tag: String, cursor: Cursor, keyword: String): ProductListResult
    getBestRatedProducts(category: String): BestRatedProductResult
    getProduct(slug: String!): ProductResult
    getTagsByCategory(category: String!): TagListResult
    getOrderById(orderId: Int!): OrderResult
  }

  type Mutation {
    checkoutOrder: CheckoutResult
    createReview(productId: Int!, description: String, rating: Int!): CreateReviewResult
    likeProduct(productId: Int!): LikeProductResult
    neutralizeLikeProduct(productId: Int!): NeutralizeLikeProductResult
    updateReview(description: String, rating: Int!, productId: Int!): UpdateReviewResult
  }
`;

export default productType;
