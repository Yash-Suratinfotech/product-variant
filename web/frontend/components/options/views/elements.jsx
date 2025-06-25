import {
  Box,
  Text,
  Scrollable,
  InlineStack,
  Button,
  BlockStack,
  Icon,
  Collapsible,
} from "@shopify/polaris";
import {
  QuestionCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DragHandleIcon,
  PlusCircleIcon,
  LayoutBuyButtonIcon,
  DuplicateIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import React, { useState, useCallback } from "react";

import {
  findElementIcon,
  findElementName,
  mockElements,
} from "../../../helpers";
import { SelectTypesPopover } from "./selectTypesPopover";
// import { useCounter } from "../../providers/CounterProvider";

export function ElementsView() {
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [groupHover, setGroupHover] = useState(false);
  const [hoveredElementId, setHoveredElementId] = useState(null);

  // const { count, mockElements } = useCounter();
  // console.log("✌️count 1--->", mockElements, count);

  // Mock elements data
  const [elements, setElements] = useState(mockElements);

  const handleElementClick = useCallback((elementId) => {
    // Update active state
    setElements((prev) =>
      prev.map((el) => ({
        ...el,
        isActive: el.id === elementId,
      }))
    );
  }, []);

  const handleAddElement = useCallback((selectedType) => {
    const newElement = {
      id: `${selectedType.type}-${Date.now()}`,
      type: selectedType.type,
      label: selectedType.content,
      icon: selectedType.icon,
      isActive: false,
    };
    setElements((prev) => [...prev, newElement]);
  }, []);

  const toggleGroup = useCallback(() => {
    setGroupExpanded(!groupExpanded);
  }, [groupExpanded]);

  return (
    <>
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
            variant="plain"
          />
        </InlineStack>
      </Box>

      {/* Scrollable Content */}
      <Scrollable style={{ width: "100%", height: "calc(100vh - 149px)" }}>
        <Box padding="300">
          <BlockStack gap="300">
            {/* Group Section */}
            <BlockStack gap="200">
              <div
                className="element-row"
                onMouseEnter={() => setGroupHover(true)}
                onMouseLeave={() => setGroupHover(false)}
              >
                <Button
                  variant="tertiary"
                  onClick={toggleGroup}
                  icon={groupExpanded ? ChevronDownIcon : ChevronRightIcon}
                  fullWidth
                  textAlign="start"
                >
                  <InlineStack gap="200" align="center" wrap={false}>
                    <Icon
                      source={groupHover ? DragHandleIcon : LayoutBuyButtonIcon}
                    />
                    <Text variant="bodyMd">Group</Text>
                    {groupHover ? (
                      <div style={{ display: "flex", marginLeft: "auto" }}>
                        <Icon source={DuplicateIcon} />
                        <Icon source={DeleteIcon} />
                      </div>
                    ) : null}
                  </InlineStack>
                </Button>
              </div>

              <Collapsible open={groupExpanded} id="group-collapsible">
                <Box paddingInlineStart="400">
                  <BlockStack gap="150">
                    {elements.map((e) => (
                      <div
                        className="element-row"
                        onMouseEnter={() => setHoveredElementId(e.id)}
                        onMouseLeave={() => setHoveredElementId(null)}
                      >
                        <Button
                          key={e.id}
                          variant="tertiary"
                          onClick={() => handleElementClick(e.id)}
                          fullWidth
                          textAlign="start"
                        >
                          <InlineStack gap="200" align="center" wrap={false}>
                            <Icon
                              source={
                                hoveredElementId === e.id
                                  ? DragHandleIcon
                                  : findElementIcon(e.type)
                              }
                            />
                            <Text variant="bodyMd">
                              {e.config?.label || findElementName(e.type)}
                            </Text>
                            {hoveredElementId === e.id && (
                              <div
                                style={{ display: "flex", marginLeft: "auto" }}
                              >
                                <Icon source={DuplicateIcon} />
                                <Icon source={DeleteIcon} />
                              </div>
                            )}
                          </InlineStack>
                        </Button>
                      </div>
                    ))}

                    {/* Add Element Button */}
                    <SelectTypesPopover
                      activator={(togglePopover) => (
                        <div className="blue-button">
                          <Button
                            variant="tertiary"
                            textAlign="start"
                            fullWidth
                            onClick={togglePopover}
                          >
                            <InlineStack gap="200" align="center">
                              <Icon source={PlusCircleIcon} />
                              <Text variant="bodyMd">Add element</Text>
                            </InlineStack>
                          </Button>
                        </div>
                      )}
                      onItemSelect={handleAddElement}
                    />
                  </BlockStack>
                </Box>
              </Collapsible>
            </BlockStack>
          </BlockStack>
        </Box>
      </Scrollable>
    </>
  );
}
