import { Box, Text, Scrollable, InlineStack, Button } from "@shopify/polaris";
import { QuestionCircleIcon } from "@shopify/polaris-icons";
import React from "react";

export function Elements() {
  return (
    <div>
      {/* Header */}
      <Box padding="300" borderBlockEndWidth="025" borderColor="border">
        <InlineStack blockAlign="center" gap="200">
          <Text variant="headingMd" as="h2" fontWeight="semibold">
            Elements
          </Text>
          <Button
            size="micro"
            icon={QuestionCircleIcon}
            accessibilityLabel="Question for selecting products"
            plain
          ></Button>
        </InlineStack>
      </Box>

      {/* Scrollable Content */}
      <Scrollable style={{ width: "100%", height: "calc(100vh - 149px)" }}>
        <Box padding="300">
          <Text variant="headingMd" as="h2" fontWeight="semibold">
            Group
          </Text>
        </Box>
        <Box padding="300">
          <Text variant="headingMd" as="h2" fontWeight="semibold">
            Group
          </Text>
        </Box>
      </Scrollable>
    </div>
  );
}
