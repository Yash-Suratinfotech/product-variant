import express from "express";
import db from "../db.js";

const router = express.Router();

// GET /data/info/option-set/:setId
router.get("/:setId", async (req, res) => {
  const { shop } = req.query;
  const { setId } = req.params;
  try {
    const optionSetResult = await db.query(
      "SELECT * FROM option_sets WHERE id = $1 AND shop_id = $2",
      [setId, shop]
    );
    if (optionSetResult.rows.length === 0) {
      return res.status(404).json({ error: "Option set not found" });
    }
    const optionSet = optionSetResult.rows[0];

    const fieldsResult = await db.query(
      "SELECT id, group_id, field_id, type, position, config, created_at FROM option_fields WHERE option_set_id = $1 ORDER BY position ASC, id ASC",
      [setId]
    );
    optionSet.fields = fieldsResult.rows;

    const productsResult = await db.query(
      "SELECT product_id FROM product_option_assignments WHERE option_set_id = $1 AND shop_id = $2",
      [setId, shop]
    );
    optionSet.products = productsResult.rows.map((row) => row.product_id);

    res.status(200).json(optionSet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
