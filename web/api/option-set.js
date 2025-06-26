import express from "express";
import shopify from "../shopify.js";
import db from "./db.js";

const router = express.Router();

// Ensure the user is authenticated
router.use(shopify.validateAuthenticatedSession());

// Get /api/option-set
router.get("/", async (req, res) => {
  try {
    const { shop } = res.locals.shopify.session;
    const optionSets = await db.query(
      "SELECT * FROM option_sets WHERE shop_id = $1 ORDER BY created_at DESC",
      [shop]
    );
    res.status(200).json(optionSets.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/option-set
router.post("/", async (req, res) => {
  const { shop } = res.locals.shopify.session;
  const { name, status, is_template, sales_channels, fields } =
    req.body;
  const client = await db.getClient();

  try {
    await client.query("BEGIN");
    const optionSetResult = await client.query(
      "INSERT INTO option_sets (shop_id, name, status, is_template, sales_channels) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [
        shop,
        name,
        status,
        is_template,
        JSON.stringify(sales_channels),
      ]
    );
    const optionSetId = optionSetResult.rows[0].id;

    for (const field of fields) {
      await client.query(
        "INSERT INTO option_fields (option_set_id, group_id, field_id, type, position, config) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          optionSetId,
          field.groupId,
          field.id,
          field.type,
          field.position,
          JSON.stringify(field.config),
        ]
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ id: optionSetId, success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// POST /api/option-set/:setId/products
router.post("/:setId/products", async (req, res) => {
  const { shop } = res.locals.shopify.session;
  const { setId } = req.params;
  const { productIds } = req.body;

  try {
    const assignments = productIds.map((productId) =>
      db.query(
        "INSERT INTO product_option_assignments (shop_id, product_id, option_set_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
        [shop, productId, setId]
      )
    );
    await Promise.all(assignments);
    res.status(200).json({ success: true, assigned: productIds.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/option-set/count
router.get("/count", async (req, res) => {
  try {
    const { shop } = res.locals.shopify.session;
    const optionSets = await db.query(
      "SELECT * FROM option_sets WHERE shop_id = $1 ORDER BY created_at DESC",
      [shop]
    );
    res.status(200).json({ count: optionSets.rows.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
