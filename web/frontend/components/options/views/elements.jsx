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

import { findElementIcon, findElementName } from "../../../helpers";
import { SelectTypesPopover } from "./selectTypesPopover";
import { useOptionSet } from "../../../components";

export function ElementsView() {
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [groupHover, setGroupHover] = useState(false);
  const [hoveredElementId, setHoveredElementId] = useState(null);

  const { selectedOptionSet, elements, setElements } = useOptionSet();
  console.log("✌️selectedOptionSet 1--->", selectedOptionSet);

  const handleElementClick = useCallback((elementId) => {
    console.log("✌️elementId --->", elementId);
  }, []);

  const handleAddElement = useCallback((selectedType) => {
    const newElement = {
      groupId: "group-1",
      id: `${selectedType.type}-${Date.now()}`,
      type: selectedType.type,
      icon: selectedType.icon,
      position: elements?.length || 0,
      config: {
        label: selectedType.content,
        name: `${selectedType.type}-${Date.now()}`,
        placeholder: `Enter ${selectedType.content}`,
        helpText: `This is a ${selectedType.content} field`,
        isRequired: true,
        defaultValue: `Default text here`,
        className: `custom-${selectedType.type}`,
        columnWidth: "100%",
      },
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
                    {elements?.map((e) => (
                      <div
                        key={e.id}
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
