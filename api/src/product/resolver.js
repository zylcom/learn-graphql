import prisma from "../../prisma/client.js";
const productResolvers = {
    Query: {
        products: async () => {
            const products = await prisma.products.findMany();
            console.log(products);
            return products;
        },
    },
};
export default productResolvers;
