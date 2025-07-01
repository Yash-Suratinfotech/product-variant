// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";

// Import API routes
import storeRoutes from "./api/store.js";
import productRoutes from "./api/products.js";
import optionSetRoutes from "./api/option-set.js";

// Import data routes
import dataOptionSetRoutes from "./api/data/option-set.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

const authenticateUser = async (req, res, next) => {
  let shop = req.query.shop;
  let shopStore = await shopify.config.sessionStorage.findSessionsByShop(shop);
  if (shop === shopStore[0].shop) {
    next();
  } else {
    res.send("User not authenticated");
  }
};

app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/data/*", authenticateUser);

app.use(express.json());

// 👇 mount /apis routes
app.use("/api/store", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/option-set", optionSetRoutes);
app.use("/data/info/option-set", dataOptionSetRoutes);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
