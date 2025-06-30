import express from "express";
// import shopify from "../shopify.js";
import db from "./db.js";

const router = express.Router();

// Ensure the user is authenticated
// router.use(shopify.validateAuthenticatedSession());

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
    console.log("✌️error --->", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/option-set
router.post("/", async (req, res) => {
  const { shop } = res.locals.shopify.session;
  const { name, status, is_template, sales_channels, fields } = req.body;
  const client = await db.getClient();

  try {
    await client.query("BEGIN");
    const optionSetResult = await client.query(
      "INSERT INTO option_sets (shop_id, name, status, is_template, sales_channels) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [shop, name, status, is_template, JSON.stringify(sales_channels)]
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

// GET /api/option-set/:setId
router.get("/:setId", async (req, res) => {
  const { shop } = res.locals.shopify.session;
  const { setId } = req.params;

  try {
    // Fetch the option set for this shop and setId
    const optionSetResult = await db.query(
      "SELECT * FROM option_sets WHERE id = $1 AND shop_id = $2",
      [setId, shop]
    );
    if (optionSetResult.rows.length === 0) {
      return res.status(404).json({ error: "Option set not found" });
    }
    const optionSet = optionSetResult.rows[0];

    // Fetch the fields for this option set
    const fieldsResult = await db.query(
      "SELECT id, group_id, field_id, type, position, config, created_at FROM option_fields WHERE option_set_id = $1 ORDER BY position ASC, id ASC",
      [setId]
    );
    optionSet.fields = fieldsResult.rows;

    res.status(200).json(optionSet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/option-set/:setId
router.put("/:setId", async (req, res) => {
  const { shop } = res.locals.shopify.session;
  const { setId } = req.params;
  const { name, status, sales_channels, fields } = req.body;
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // Update the option set
    await client.query(
      "UPDATE option_sets SET name = $1, status = $2, sales_channels = $3 WHERE id = $4 AND shop_id = $5",
      [name, status, JSON.stringify(sales_channels), setId, shop]
    );

    // Delete existing fields for this option set
    await client.query("DELETE FROM option_fields WHERE option_set_id = $1", [
      setId,
    ]);

    // Insert new fields
    for (const field of fields) {
      await client.query(
        "INSERT INTO option_fields (option_set_id, group_id, field_id, type, position, config) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          setId,
          field.groupId,
          field.id,
          field.type,
          field.position,
          JSON.stringify(field.config),
        ]
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ success: true });
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
    const assignments = productIds?.map((productId) =>
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

export default router;
