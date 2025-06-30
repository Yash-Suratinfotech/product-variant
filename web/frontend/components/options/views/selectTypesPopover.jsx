import {
  Button,
  Popover,
  ActionList,
  Tabs,
  InlineStack,
  Icon,
  Text,
  Box,
} from "@shopify/polaris";
import { StarFilledIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import {
  defaultInputTypes,
  defaultSelectionTypes,
  defaultStaticTypes,
} from "../../../helpers";

export function SelectTypesPopover({
  buttonText = "More actions",
  buttonProps = {},
  activator = null,
  onItemSelect = () => {},
}) {
  const [popoverActive, setPopoverActive] = useState(false);
  const [selected, setSelected] = useState(0);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "option-types",
      content: "Option Types",
      accessibilityLabel: "Option Types",
      panelID: "option-types-content",
    },
    // {
    //   id: "our-templates",
    //   content: "Our Templates",
    //   accessibilityLabel: "Our Templates",
    //   panelID: "our-templates-content",
    // },
    // {
    //   id: "my-templates",
    //   content: "My Templates",
    //   accessibilityLabel: "My Templates",
    //   panelID: "my-templates-content",
    // },
  ];

  const renderTypesList = (defaultTypes) => {
    return defaultTypes.map((type, index) => ({
      content: (
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap="200" blockAlign="center">
            <Icon
              source={type.icon}
              tone={type.disabled ? "subdued" : "base"}
            />
            <Text variant="bodyMd" tone={type.disabled ? "disabled" : ""}>
              {type.content}
            </Text>
          </InlineStack>
          {type.disabled && (
            <div style={{ width: "14px", height: "14px" }}>
              <Icon source={StarFilledIcon} tone="warning" />
            </div>
          )}
        </InlineStack>
      ),
      ...(type.disabled
        ? {}
        : {
            onAction: () => {
              onItemSelect(type);
              setPopoverActive(false);
            },
          }),
    }));
  };

  const defaultActivator = (
    <Button onClick={togglePopoverActive} {...buttonProps}>
      {buttonText}
    </Button>
  );

  // If activator is a function, call it with togglePopoverActive
  const resolvedActivator =
    typeof activator === "function"
      ? activator(togglePopoverActive)
      : activator || defaultActivator;

  return (
    <>
      <Popover
        active={popoverActive}
        activator={resolvedActivator}
        ariaHaspopup="listbox"
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
        preferredAlignment="left"
      >
        <Box minWidth="700px">
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={handleTabChange}
            fitted
          >
            <Box padding="300">
              {selected === 0 && (
                <InlineStack gap="400" align="space-between">
                  <Box minWidth="200px">
                    <Text variant="headingSm" as="h3">
                      Input
                    </Text>
                    <Box paddingBlockStart="200">
                      <ActionList
                        actionRole="menuitem"
                        items={renderTypesList(defaultInputTypes)}
                      />
                    </Box>
                  </Box>

                  <Box minWidth="200px">
                    <Text variant="headingSm" as="h3">
                      Selection
                    </Text>
                    <Box paddingBlockStart="200">
                      <ActionList
                        actionRole="menuitem"
                        items={renderTypesList(defaultSelectionTypes)}
                      />
                    </Box>
                  </Box>

                  <Box minWidth="200px">
                    <Text variant="headingSm" as="h3">
                      Static
                    </Text>
                    <Box paddingBlockStart="200">
                      <ActionList
                        actionRole="menuitem"
                        items={renderTypesList(defaultStaticTypes)}
                      />
                    </Box>
                  </Box>
                </InlineStack>
              )}

              {selected === 1 && (
                <Box>
                  <Text variant="bodyMd">Our Templates content</Text>
                </Box>
              )}

              {selected === 2 && (
                <Box>
                  <Text variant="bodyMd">My Templates content</Text>
                </Box>
              )}
            </Box>
          </Tabs>
        </Box>
      </Popover>
    </>
  );
}
