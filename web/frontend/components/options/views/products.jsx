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
  Thumbnail,
  ResourceList,
  ResourceItem,
  Spinner,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  QuestionCircleIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import React, { useState, useCallback, useEffect } from "react";

import { Knob } from "../../Knob";
import { ProductPicker } from "./productPicker";
import { useOptionSet } from "../../../components";
import { productsHook } from "../../../hooks";

export function Products() {
  const { optionSet, setOptionSet } = useOptionSet();
  const { products, loading, fetchProducts } = productsHook();

  // Product selection state
  const [pickerOpen, setPickerOpen] = useState(false);
  // Toggle states for each section
  const [selectionProduct, setSelectionProduct] = useState(false);
  const [automaticRulesActive, setAutomaticRulesActive] = useState(false);
  const [allProduct, setAllProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Handle toggle logic
  const handleManualToggle = useCallback((checked) => {
    setSelectionProduct(checked);
    if (checked) {
      // If manual is enabled, disable others
      setAutomaticRulesActive(false);
      setAllProduct(false);
    }
  }, []);

  const handleAutomaticToggle = useCallback((checked) => {
    setAutomaticRulesActive(checked);
    if (checked) {
      // If automatic is enabled, disable others
      setSelectionProduct(false);
      setAllProduct(false);
    }
  }, []);

  const handleApplyAllToggle = useCallback((checked) => {
    setAllProduct(checked);
    if (checked) {
      // If apply to all is enabled, disable others
      setSelectionProduct(false);
      setAutomaticRulesActive(false);
    }
  }, []);

  useEffect(() => {
    setOptionSet((prev) => ({
      ...prev,
      all_product: allProduct,
    }));
  }, [allProduct]);

  useEffect(() => {
    (async () => {
      const data = await fetchProducts();
      if (data && data.length > 0) {
        if (optionSet.all_product) {
          handleApplyAllToggle(true);
        } else {
          if (optionSet.products && optionSet.products.length > 0) {
            const selected = data.filter((p) => optionSet.products.includes(p));
            setSelectedProducts(selected);
            handleManualToggle(true);
          }
        }
      }
    })();
  }, []);

  const handleProductSelect = (selectedIds) => {
    // Filter products based on selected IDs
    const selected = products.filter((p) => selectedIds.includes(p.id));
    setSelectedProducts(selected);

    setOptionSet((prev) => ({
      ...prev,
      products: selectedIds,
    }));
  };

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
                icon={selectionProduct ? ChevronDownIcon : ChevronRightIcon}
              />
              <BlockStack>
                <Text variant="bodyMd" fontWeight="medium">
                  Manual Selection {pickerOpen}
                </Text>
                <Text variant="bodySm" tone="subdued">
                  Choose specific products to apply this option set.
                </Text>
              </BlockStack>
              <div style={{ marginLeft: "auto" }}>
                <Knob
                  ariaLabel="Manual selection toggle"
                  selected={selectionProduct}
                  onClick={() => handleManualToggle(!selectionProduct)}
                />
              </div>
            </InlineStack>

            <Collapsible
              open={selectionProduct}
              id="manual-selection-collapsible"
            >
              <BlockStack gap="300">
                <Text variant="bodyMd" fontWeight="medium">
                  Products
                </Text>

                <TextField
                  placeholder="Select products"
                  prefix={<Icon source={SearchIcon} />}
                  autoComplete="off"
                  onChange={() => setPickerOpen(true)}
                />

                {loading ? (
                  <div style={{ textAlign: "center", padding: "50px auto" }}>
                    <Spinner
                      accessibilityLabel="Loading products"
                      size="large"
                    />
                  </div>
                ) : (
                  selectedProducts.length > 0 && (
                    <ResourceList
                      resourceName={{ singular: "product", plural: "products" }}
                      items={selectedProducts}
                      selectable
                      renderItem={(i) => {
                        return (
                          <ResourceItem
                            id={i.id}
                            accessibilityLabel={`Select ${i.title}`}
                          >
                            <InlineStack
                              wrap={false}
                              gap="400"
                              blockAlign="center"
                            >
                              {i.image ? (
                                <Thumbnail
                                  source={i.image || ""}
                                  alt={i.title}
                                  size="small"
                                />
                              ) : (
                                <Thumbnail source={ImageIcon} size="small" />
                              )}
                              <Text fontWeight="medium">{i.title}</Text>
                            </InlineStack>
                          </ResourceItem>
                        );
                      }}
                    />
                  )
                )}

                {/* No Products Found State */}
                {!loading && selectedProducts.length === 0 && (
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
                )}
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
                icon={automaticRulesActive ? ChevronDownIcon : ChevronRightIcon}
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
                icon={allProduct ? ChevronDownIcon : ChevronRightIcon}
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
                  selected={allProduct}
                  onClick={() => handleApplyAllToggle(!allProduct)}
                />
              </div>
            </InlineStack>
          </BlockStack>
        </Box>
      </Scrollable>

      {/* Model For Product Selection */}
      <ProductPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleProductSelect}
      />
    </div>
  );
}
