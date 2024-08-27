import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import productTypeDefs from "./product/produc.type.js";
import productResolver from "./product/product.resolver.js";
const typeDefs = `#graphql
  scalar Datetime

  ${productTypeDefs}
`;
const resolvers = {
    Query: {
        products: productResolver.getAll,
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀  Server ready at: ${url}`);
