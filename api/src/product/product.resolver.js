import { GraphQLError } from "graphql";
import prisma from "../../prisma/client.js";
async function getAll() {
    const products = await prisma.products.findMany().catch(() => {
        throw new GraphQLError("Internal server error");
    });
    return products;
}
export default { getAll };
