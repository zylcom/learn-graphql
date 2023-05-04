import cors from "cors";
import express, { json, urlencoded } from "express";
import { ApolloServer } from "@apollo/server";
import { expressjwt } from "express-jwt";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "../src/schema.js";

const app = express();
const PORT = 4000;
const SECRET_KEY = process.env.SECRET_KEY;
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  introspection: true,
  embed: true,
});

await server.start();

app.use(
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.authorization?.split(" ")[1] }),
  })
);
app.use(expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }));

app.listen(PORT, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT}`);
});
