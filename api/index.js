import Stripe from "stripe";
import cors from "cors";
import express, { json, urlencoded } from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageProductionDefault } from "@apollo/server/plugin/landingPage/default";
import { expressjwt } from "express-jwt";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "../src/schema.js";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 4000;
const SECRET_KEY = process.env.SECRET_KEY;
const corsOptions = {
  origin: "*",
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient({ errorFormat: "minimal" });

app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  introspection: true,
  plugins: [ApolloServerPluginLandingPageProductionDefault({ embed: true })],
});

await server.start();

app.post(
  "/webhook",
  express.raw({
    type: "application/json",
  }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);

      res.status(400).send(`Webhook Error: ${err.message}`);

      return;
    }

    console.log("✅ Success:", event.id);

    // Handle the event
    switch (event.type) {
      case "checkout.session.async_payment_failed":
        const checkoutSessionAsyncPaymentFailed = event.data.object;

        console.log(checkoutSessionAsyncPaymentFailed, "checkout.session.async_payment_failed");
        break;

      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;

        console.log(checkoutSessionAsyncPaymentSucceeded, "checkout.session.async_payment_succeeded");
        break;

      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;

        try {
          const order = await prisma.orderRecord.update({
            where: { checkoutSessionId: checkoutSessionCompleted.id },
            data: {
              status: checkoutSessionCompleted.status,
              amountSubtotal: checkoutSessionCompleted.amount_subtotal,
              amountTotal: checkoutSessionCompleted.amount_total,
              payment: {
                create: {
                  amount: checkoutSessionCompleted.amount_total,
                  status: checkoutSessionCompleted.payment_status,
                  method: checkoutSessionCompleted.payment_method_types[0],
                },
              },
              receipt: {
                create: {},
              },
              shipment: {
                create: {
                  address: checkoutSessionCompleted.customer_details.address.line1,
                  city: checkoutSessionCompleted.customer_details.address.city,
                  country: checkoutSessionCompleted.customer_details.address.country,
                  zipCode: checkoutSessionCompleted.customer_details.address.postal_code,
                  state: checkoutSessionCompleted.customer_details.address.state,
                  detail: checkoutSessionCompleted.customer_details.address.line2,
                  name: checkoutSessionCompleted.customer_details.name,
                  phone: checkoutSessionCompleted.customer_details.phone,
                  deliverCost: checkoutSessionCompleted.shipping_cost,
                },
              },
            },
          });

          await prisma.cart.update({ where: { id: order.userId }, data: { cartItems: { deleteMany: {} } } });

          console.log(checkoutSessionCompleted, "checkout.session.completed");
        } catch (error) {
          console.log(error.message);
        }

        break;

      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;

        console.log(checkoutSessionExpired, "checkout.session.expired");
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

app.use(json());

app.use(
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.authorization?.split(" ")[1] }),
  }),
  json()
);
app.use(expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }));

app.listen(PORT, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT}`);
});
