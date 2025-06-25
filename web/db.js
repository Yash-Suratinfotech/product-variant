import dotenv from "dotenv";
dotenv.config();

import { Client } from "pg";
const DB_URL = process.env.DB_URL;

const client = new Client({
  connectionString: DB_URL,
});

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS option_sets (
    id SERIAL PRIMARY KEY,
    shop_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(255) NOT NULL DEFAULT 'Draft',
    sales_channels JSONB DEFAULT '[]',
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS option_fields (
    id SERIAL PRIMARY KEY,
    option_set_id INTEGER REFERENCES option_sets(id) ON DELETE CASCADE,
    group_id VARCHAR(255),
    field_id VARCHAR(255) UNIQUE,
    type VARCHAR(50) NOT NULL,
    config JSONB NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS product_option_assignments (
    id SERIAL PRIMARY KEY,
    shop_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    option_set_id INTEGER REFERENCES option_sets(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, option_set_id)
  );

  CREATE TABLE IF NOT EXISTS variant_field_values (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(255),
    line_item_id VARCHAR(255),
    product_id VARCHAR(255),
    field_id VARCHAR(255),
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

await client.end();
console.log("✅ Tables initialized.");
