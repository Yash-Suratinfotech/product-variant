import {
  Box,
  Text,
  InlineStack,
  Scrollable,
  Button,
  BlockStack,
  Tooltip,
} from "@shopify/polaris";
import {
  LayoutBuyButtonIcon,
  ProductIcon,
  PersonIcon,
} from "@shopify/polaris-icons";
import React from "react";

export function ElementMain() {
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
                <Button icon={LayoutBuyButtonIcon} />
              </Tooltip>
              <Tooltip content="Products" dismissOnMouseOut>
                <Button icon={ProductIcon} />
              </Tooltip>
              <Tooltip content="Customers" dismissOnMouseOut>
                <Button icon={PersonIcon} />
              </Tooltip>
            </BlockStack>
          </Box>

          <Box width="100%" padding="0">
            <Box padding="300" borderBlockEndWidth="025" borderColor="border">
              <Text variant="headingMd" as="h2" fontWeight="semibold">
                Elements
              </Text>
            </Box>
            <Scrollable
              style={{ width: "100%", height: "calc(100vh - 149px)" }}
            >
              <Box padding="300">
                <Text variant="headingMd" as="h2" fontWeight="semibold">
                  Group
                </Text>
              </Box>
            </Scrollable>
          </Box>
        </InlineStack>
      </Box>
    </div>
  );
}
