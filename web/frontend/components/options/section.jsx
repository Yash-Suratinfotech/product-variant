import React, { useState } from "react";
import {
  Box,
  InlineStack,
  Button,
  BlockStack,
  Tooltip,
} from "@shopify/polaris";
import {
  LayoutBuyButtonIcon,
  ProductIcon,
  PersonIcon,
} from "@shopify/polaris-icons";

import { Elements } from "./views/elements";
import { Products } from "./views/products";
import { Customers } from "./views/customers";

export function Section() {
  const [activeTab, setActiveTab] = useState("elements");

  const renderContent = () => {
    switch (activeTab) {
      case "elements":
        return <Elements />;
      case "products":
        return <Products />;
      case "customers":
        return <Customers />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Box
        background="bg-surface"
        borderInlineEndWidth="025"
        borderColor="border"
      >
        <InlineStack wrap={false}>
          <Box padding="300" borderInlineEndWidth="025" borderColor="border">
            <BlockStack gap={300}>
              <Tooltip content="Elements" dismissOnMouseOut>
                <Button
                  size="large"
                  icon={LayoutBuyButtonIcon}
                  onClick={() => setActiveTab("elements")}
                  pressed={activeTab === "elements"}
                />
              </Tooltip>
              <Tooltip content="Products" dismissOnMouseOut>
                <Button
                  size="large"
                  icon={ProductIcon}
                  onClick={() => setActiveTab("products")}
                  pressed={activeTab === "products"}
                />
              </Tooltip>
              <Tooltip content="Customers" dismissOnMouseOut>
                <Button
                  size="large"
                  icon={PersonIcon}
                  onClick={() => setActiveTab("customers")}
                  pressed={activeTab === "customers"}
                />
              </Tooltip>
            </BlockStack>
          </Box>

          <Box width="100%" padding="0">
            {renderContent()}
          </Box>
        </InlineStack>
      </Box>
    </div>
  );
}
