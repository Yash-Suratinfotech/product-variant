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

// GET /api/store/details
router.get("/details", async (req, res) => {
  try {
    const client = new shopify.api.clients.Rest({
      session: res.locals.shopify.session,
    });

    // Fetch shop data
    const shopResponse = await client.get({ path: "shop" });
    const shop = shopResponse?.body?.shop;

    // Fetch additional counts in parallel
    const [productsCount, ordersCount] = await Promise.all([
      client.get({ path: "products/count" }),
      client.get({ path: "orders/count" }),
    ]);

    // Return detailed store information
    const detailed = {
      // Basic Information
      id: shop.id,
      name: shop.name,
      email: shop.email,
      domain: shop.domain,
      myshopify_domain: shop.myshopify_domain,

      // Owner Information
      shop_owner: shop.shop_owner,
      customer_email: shop.customer_email,

      // Plan Information
      plan_name: shop.plan_name,
      plan_display_name: shop.plan_display_name,

      // Location Information
      address1: shop.address1,
      address2: shop.address2,
      city: shop.city,
      province: shop.province,
      province_code: shop.province_code,
      country: shop.country,
      country_code: shop.country_code,
      country_name: shop.country_name,
      zip: shop.zip,
      latitude: shop.latitude,
      longitude: shop.longitude,

      // Contact Information
      phone: shop.phone,
      primary_locale: shop.primary_locale,

      // Business Information
      currency: shop.currency,
      iana_timezone: shop.iana_timezone,
      timezone: shop.timezone,
      weight_unit: shop.weight_unit,
      taxes_included: shop.taxes_included,
      tax_shipping: shop.tax_shipping,

      // Store Features
      has_gift_cards: shop.has_gift_cards,
      has_storefront: shop.has_storefront,
      has_discounts: shop.has_discounts,
      eligible_for_payments: shop.eligible_for_payments,
      multi_location_enabled: shop.multi_location_enabled,

      // Timestamps
      created_at: shop.created_at,
      updated_at: shop.updated_at,

      // Additional Stats
      products_count: productsCount?.body?.count,
      orders_count: ordersCount?.body?.count,
    };

    res.status(200).json(detailed);
  } catch (error) {
    console.error("Failed to fetch store details:", error);
    res.status(500).json({ error: "Failed to fetch store details" });
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
