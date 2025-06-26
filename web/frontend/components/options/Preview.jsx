import {
  Box,
  Scrollable,
  SkeletonDisplayText,
  SkeletonBodyText,
  BlockStack,
  InlineGrid,
  Text,
} from "@shopify/polaris";
import React from "react";
import { useOptionSet } from "../../components";

export function Preview() {
  const { elements } = useOptionSet();

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
              <form>
                {elements?.map((e) => (
                  <div key={e.id}>
                    <Text variant="bodyMd">{e.config?.label}</Text>
                    <input type={e?.type} name={e.config?.name} />
                    <br />
                  </div>
                ))}
              </form>
            </BlockStack>
          </InlineGrid>
        </Box>
      </Scrollable>
    </Box>
  );
}
