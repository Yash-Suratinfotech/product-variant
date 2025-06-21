import {
  Box,
  Scrollable,
  SkeletonDisplayText,
  SkeletonBodyText,
  BlockStack,
} from "@shopify/polaris";
import React from "react";

export function Preview() {
  return (
    <Box background="bg-surface">
      <Scrollable style={{ width: "100%", height: "calc(100vh - 105px)" }}>
        <Box padding="300">
          <BlockStack gap={300}>
            <SkeletonDisplayText  />
            <SkeletonBodyText />
          </BlockStack>
        </Box>
      </Scrollable>
    </Box>
  );
}
