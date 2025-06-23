import {
  Box,
  Text,
  Scrollable,
  InlineStack,
  BlockStack,
  Button,
  TextField,
  Icon,
  Collapsible,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  QuestionCircleIcon,
} from "@shopify/polaris-icons";
import { Knob } from "../../Knob";
import React, { useState, useCallback } from "react";

export function Products() {
  // Toggle states for each section
  const [manualSelectionActive, setManualSelectionActive] = useState(true);
  const [automaticRulesActive, setAutomaticRulesActive] = useState(false);
  const [applyToAllActive, setApplyToAllActive] = useState(false);

  // Collapse states
  const [manualExpanded, setManualExpanded] = useState(true);
  const [automaticExpanded, setAutomaticExpanded] = useState(false);
  const [applyAllExpanded, setApplyAllExpanded] = useState(false);

  // Product selection state
  const [searchValue, setSearchValue] = useState("");
  // const [selectedProducts, setSelectedProducts] = useState([]);

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

  // Handle section expansion (clicking on the section header)
  // const handleManualExpansion = useCallback(() => {
  //   if (manualSelectionActive) {
  //     setManualExpanded(!manualExpanded);
  //   }
  // }, [manualSelectionActive, manualExpanded]);

  // const handleAutomaticExpansion = useCallback(() => {
  //   if (automaticRulesActive) {
  //     setAutomaticExpanded(!automaticExpanded);
  //   }
  // }, [automaticRulesActive, automaticExpanded]);

  // const handleApplyAllExpansion = useCallback(() => {
  //   if (applyToAllActive) {
  //     setApplyAllExpanded(!applyAllExpanded);
  //   }
  // }, [applyToAllActive, applyAllExpanded]);

  return (
    <div>
      {/* Header */}
      <Box padding="300" borderBlockEndWidth="025" borderColor="border">
        <InlineStack blockAlign="center" gap="200">
          <Text variant="headingMd" as="h2" fontWeight="semibold">
            Select products
          </Text>
          <Button
            size="micro"
            icon={QuestionCircleIcon}
            accessibilityLabel="Question for selecting products"
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
                  Choose specific products to apply this option set.
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

            <Collapsible
              open={manualExpanded && manualSelectionActive}
              id="manual-selection-collapsible"
            >
              <BlockStack gap="300">
                <Text variant="bodyMd" fontWeight="medium">
                  Products
                </Text>

                <TextField
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Select products"
                  prefix={<Icon source={SearchIcon} />}
                  autoComplete="off"
                />

                {/* No Products Found State */}
                <Box
                  padding="600"
                  background="bg-surface-secondary"
                  borderRadius="200"
                  align="center"
                >
                  <BlockStack gap="300" align="center">
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "#e3e3e3",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        margin: "0 auto",
                      }}
                    >
                      <Text variant="heading3xl" fontWeight="bold">
                        📦
                      </Text>
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-5px",
                          right: "-5px",
                          background: "#2563EB",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          variant="bodySm"
                          fontWeight="bold"
                          tone="text-inverse"
                        >
                          ?
                        </Text>
                      </div>
                    </div>
                    <BlockStack gap="100" align="center">
                      <Text variant="bodyMd" fontWeight="medium">
                        No products found
                      </Text>
                      <Text variant="bodySm" tone="subdued">
                        Select at least 1 product to apply the option set
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Box>
              </BlockStack>
            </Collapsible>
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
                  Apply options based on product conditions (e.g. tags,
                  collections)
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

        {/* Apply to All Products Section */}
        <Box padding="300" borderBlockEndWidth="025" borderColor="border">
          <BlockStack gap="300">
            <InlineStack blockAlign="center" gap={300}>
              <Button
                variant="plain"
                icon={applyAllExpanded ? ChevronDownIcon : ChevronRightIcon}
              ></Button>
              <BlockStack>
                <Text variant="bodyMd" fontWeight="medium">
                  Apply to All Products
                </Text>
                <Text variant="bodySm" tone="subdued">
                  Automatically apply this option set to all store products.
                </Text>
              </BlockStack>
              <div style={{ marginLeft: "auto" }}>
                <Knob
                  ariaLabel="Apply to All Products toggle"
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
