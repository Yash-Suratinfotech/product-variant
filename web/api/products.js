import express from "express";
import shopify from "../shopify.js";

const router = express.Router();

// Helper: create products via REST API
async function productCreator(session, count) {
  const client = new shopify.api.clients.Rest({ session });

  for (let i = 0; i < count; i++) {
    await client.post({
      path: "products",
      data: {
        product: {
          title: "Test Product (via REST)",
          body_html: "<strong>Good product!</strong>",
          vendor: "Your Brand",
          product_type: "Custom",
          status: "active",
        },
      },
      type: "application/json",
    });
  }
}

// GET /api/products/count
router.get("/count", async (_req, res) => {
  const client = new shopify.api.clients.Rest({
    session: res.locals.shopify.session,
  });

  try {
    const response = await client.get({ path: "products/count" });
    res.status(200).send({ count: response.body.count });
  } catch (error) {
    console.error("REST count error:", error);
    res.status(500).send({ error: "Failed to fetch product count" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session, 1);
  } catch (e) {
    console.error(`Failed to create product via REST: ${e.message}`);
    status = 500;
    error = e.message;
  }

  res.status(status).send({ success: status === 200, error });
});

export default router;
