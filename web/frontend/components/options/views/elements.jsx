import {
  Box,
  Text,
  Scrollable,
  InlineStack,
  Button,
  BlockStack,
  Card,
  Icon,
  Collapsible,
} from "@shopify/polaris";
import {
  QuestionCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DragHandleIcon,
  PlusCircleIcon,
  SelectIcon,
  TextBlockIcon,
  CheckboxIcon,
  LayoutBuyButtonIcon,
  DuplicateIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import React, { useState, useCallback } from "react";

import { SelectTypesPopover } from "./selectTypesPopover";

export function Elements() {
  const [groupExpanded, setGroupExpanded] = useState(true);
  const [selectedElement, setSelectedElement] = useState("select");
  const [groupHover, setGroupHover] = useState(false);
  const [hoveredElementId, setHoveredElementId] = useState(null);

  // Mock elements data
  const [elements, setElements] = useState([
    {
      id: "select-1",
      type: "select",
      label: "Select",
      icon: SelectIcon,
      isActive: true,
    },
    {
      id: "textarea-1",
      type: "textarea",
      label: "Textarea",
      icon: TextBlockIcon,
      isActive: false,
    },
    {
      id: "checkbox-1",
      type: "checkbox",
      label: "Checkbox",
      icon: CheckboxIcon,
      isActive: false,
    },
  ]);

  const handleElementClick = useCallback((elementId) => {
    setSelectedElement(elementId);
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
                    {elements.map((element) => (
                      <div
                        className="element-row"
                        onMouseEnter={() => setHoveredElementId(element.id)}
                        onMouseLeave={() => setHoveredElementId(null)}
                      >
                        <Button
                          key={element.id}
                          variant="tertiary"
                          onClick={() => handleElementClick(element.id)}
                          fullWidth
                          textAlign="start"
                        >
                          <InlineStack gap="200" align="center" wrap={false}>
                            <Icon
                              source={
                                hoveredElementId === element.id
                                  ? DragHandleIcon
                                  : element.icon
                              }
                            />
                            <Text variant="bodyMd">{element.label}</Text>
                            {hoveredElementId === element.id && (
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
