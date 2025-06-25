import {
  Box,
  Text,
  Scrollable,
  InlineStack,
  BlockStack,
  Button,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  QuestionCircleIcon,
} from "@shopify/polaris-icons";
import { Knob } from "../../Knob";
import React, { useState, useCallback } from "react";

export function Customers() {
  // Toggle states for each section
  const [manualSelectionActive, setManualSelectionActive] = useState(false);
  const [automaticRulesActive, setAutomaticRulesActive] = useState(false);
  const [applyToAllActive, setApplyToAllActive] = useState(true);

  // Collapse states
  const [manualExpanded, setManualExpanded] = useState(false);
  const [automaticExpanded, setAutomaticExpanded] = useState(false);
  const [applyAllExpanded, setApplyAllExpanded] = useState(true);

  // Handle toggle logic
  const handleManualToggle = useCallback((checked) => {
    setManualSelectionActive(checked);
    if (checked) {
      // If manual is enabled, disable others
      setAutomaticRulesActive(false);
      setApplyToAllActive(false);
      setManualExpanded(true);
      setAutomaticExpanded(false);
      setApplyAllExpanded(false);
    } else {
      setManualExpanded(false);
    }
  }, []);

  const handleAutomaticToggle = useCallback((checked) => {
    setAutomaticRulesActive(checked);
    if (checked) {
      // If automatic is enabled, disable others
      setManualSelectionActive(false);
      setApplyToAllActive(false);
      setAutomaticExpanded(true);
      setManualExpanded(false);
      setApplyAllExpanded(false);
    } else {
      setAutomaticExpanded(false);
    }
  }, []);

  const handleApplyAllToggle = useCallback((checked) => {
    setApplyToAllActive(checked);
    if (checked) {
      // If apply to all is enabled, disable others
      setManualSelectionActive(false);
      setAutomaticRulesActive(false);
      setApplyAllExpanded(true);
      setManualExpanded(false);
      setAutomaticExpanded(false);
    } else {
      setApplyAllExpanded(false);
    }
  }, []);

  return (
    <div>
      {/* Header */}
      <Box padding="300" borderBlockEndWidth="025" borderColor="border">
        <InlineStack blockAlign="center" gap="200">
          <Text variant="headingMd" as="h2" fontWeight="semibold">
            Select customers
          </Text>
          <Button
            size="micro"
            icon={QuestionCircleIcon}
            accessibilityLabel="Question for selecting customers"
            variant="plain"
          ></Button>
        </InlineStack>
      </Box>

      {/* Scrollable Content */}
      <Scrollable style={{ width: "100%", height: "calc(100vh - 149px)" }}>
        {/* Manual Selection Section */}
        <Box padding="300" borderBlockEndWidth="025" borderColor="border">
          <BlockStack gap="300">
            <InlineStack blockAlign="center" gap={300}>
              <Button
                variant="plain"
                icon={manualExpanded ? ChevronDownIcon : ChevronRightIcon}
              ></Button>
              <BlockStack>
                <Text variant="bodyMd" fontWeight="medium">
                  Manual Selection
                </Text>
                <Text variant="bodySm" tone="subdued">
                  Only show this option set to specific customers you select.
                </Text>
              </BlockStack>
              <div style={{ marginLeft: "auto" }}>
                <Knob
                  ariaLabel="Manual selection toggle"
                  selected={manualSelectionActive}
                  onClick={() => handleManualToggle(!manualSelectionActive)}
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Box>

        {/* Automatic Rules Section */}
        <Box padding="300" borderBlockEndWidth="025" borderColor="border">
          <BlockStack gap="300">
            <InlineStack blockAlign="center" gap={300}>
              <Button
                variant="plain"
                icon={automaticExpanded ? ChevronDownIcon : ChevronRightIcon}
              ></Button>
              <BlockStack>
                <Text variant="bodyMd" fontWeight="medium">
                  Automatic Rules
                </Text>
                <Text variant="bodySm" tone="subdued">
                  Show the option set to customers based on rules like customer
                  tags, email, logged-in, guest.
                </Text>
              </BlockStack>
              <div style={{ marginLeft: "auto" }}>
                <Knob
                  ariaLabel="Automatic Rules toggle"
                  selected={automaticRulesActive}
                  onClick={() => handleAutomaticToggle(!automaticRulesActive)}
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Box>

        {/* Apply to Everyone Section */}
        <Box padding="300" borderBlockEndWidth="025" borderColor="border">
          <BlockStack gap="300">
            <InlineStack blockAlign="center" gap={300}>
              <Button
                variant="plain"
                icon={applyAllExpanded ? ChevronDownIcon : ChevronRightIcon}
              ></Button>
              <BlockStack>
                <Text variant="bodyMd" fontWeight="medium">
                  Everyone
                </Text>
                <Text variant="bodySm" tone="subdued">
                  Make this option set visible to all customers, no matter who
                  they are.
                </Text>
              </BlockStack>
              <div style={{ marginLeft: "auto" }}>
                <Knob
                  ariaLabel="Apply to Everyone"
                  selected={applyToAllActive}
                  onClick={() => handleApplyAllToggle(!applyToAllActive)}
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Box>
      </Scrollable>
    </div>
  );
}
