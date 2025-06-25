import express from "express";
import shopify from "../shopify.js";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  const { title = "", limit = 20 } = req.query;

  try {
    const client = new shopify.api.clients.Rest({
      session: res.locals.shopify.session,
    });

    // Build query string for product search
    let queryParams = `limit=${limit}`;
    if (title != "") {
      queryParams += `&title=${encodeURIComponent(title)}`;
    }

    const response = await client.get({
      path: `products`,
      query: {
        limit,
        title,
      },
    });

    // Format simplified response for your modal
    const simplified = response.body.products.map((p) => ({
      id: p.id,
      title: p.title,
      image: p.image?.src || "", // fallback in case no image
    }));

    res.status(200).json(simplified);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  let status = 200;
  let error = null;

  try {
    const client = new shopify.api.clients.Rest({
      session: res.locals.shopify.session,
    });
    // Create 1 product (can adjust count if needed)
    for (let i = 0; i < 1; i++) {
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
  } catch (e) {
    console.error(`Failed to create product via REST: ${e.message}`);
    status = 500;
    error = e.message;
  }

  res.status(status).send({ success: status === 200, error });
});

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

export default router;
