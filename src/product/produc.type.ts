const productTypeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    slug: String!
    price: Int!
    image: String
    categorySlug: String!
    ingredients: String
    createdAt: Datetime
    updatedAt: Datetime
    averageRating: Float
  }

  type Query {
    products: [Product]
  }
`;

export default productTypeDefs;
