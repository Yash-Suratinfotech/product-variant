import {
  Box,
  Scrollable,
  SkeletonDisplayText,
  SkeletonBodyText,
  BlockStack,
  InlineGrid,
} from "@shopify/polaris";
import React from "react";

export function Preview() {
  return (
    <Box background="bg-surface">
      <Scrollable style={{ width: "100%", height: "calc(100vh - 105px)" }}>
        <Box padding="300">
          <InlineGrid columns="auto 1fr" gap={500}>
            <div
              className="Polaris-SkeletonDisplayText__DisplayText"
              style={{ width: "200px", maxWidth: "200px", height: "200px" }}
            ></div>
            <BlockStack gap={300}>
              <SkeletonDisplayText />
              <SkeletonBodyText />
            </BlockStack>
          </InlineGrid>
        </Box>
      </Scrollable>
    </Box>
  );
}
