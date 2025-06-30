// web/api/store.js

import express from "express";
import shopify from "../shopify.js";
import db from "./db.js";

const router = express.Router();

// GET /api/store/info
router.get("/info", async (req, res) => {
  try {
    const client = new shopify.api.clients.Rest({
      session: res.locals.shopify.session,
    });

    const response = await client.get({ path: "shop" });
    const shop = response?.body?.shop;

    // Return simplified store information
    const simplified = {
      name: shop.name,
      domain: shop.domain,
      email: shop.email,
      plan_display_name: shop.plan_display_name,
      shop_owner: shop.shop_owner,
      country_name: shop.country_name,
      currency: shop.currency,
    };

    res.status(200).json(simplified);
  } catch (error) {
    console.error("Failed to fetch store info:", error);
    res.status(500).json({ error: "Failed to fetch store info" });
  }
});

// GET /api/store/stats
router.get("/stats", async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new shopify.api.clients.Rest({
      session,
    });

    // Fetch multiple counts in parallel
    const [products, orders, customers, collections, optionSets] =
      await Promise.all([
        client.get({ path: "products/count" }),
        client.get({ path: "orders/count" }),
        client.get({ path: "customers/count" }),
        client.get({ path: "custom_collections/count" }),
        db.query(
          "SELECT * FROM option_sets WHERE shop_id = $1 ORDER BY created_at DESC",
          [session.shop]
        ),
      ]);

    const stats = {
      products: products?.body?.count,
      orders: orders?.body?.count,
      customers: customers?.body?.count,
      collections: collections?.body?.count,
      option_sets: optionSets?.rows?.length, // This is the option Sets count
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Failed to fetch store stats:", error);
    res.status(500).json({ error: "Failed to fetch store stats" });
  }
});

export default router;
