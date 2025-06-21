import {
  Page,
  Layout,
  Card,
  InlineStack,
  Text,
  Badge,
  Modal,
  Button,
  TextField,
  Select,
  Checkbox,
  BlockStack,
  Box,
  Popover,
  ActionList,
  Icon,
} from "@shopify/polaris";
import { MenuHorizontalIcon } from "@shopify/polaris-icons";
import React, { useState, useCallback } from "react";

export default function LayoutExample() {
  // State for option set data
  const [optionSet, setOptionSet] = useState({
    title: "New Option Set",
    status: "Active",
    salesChannels: {
      onlineStore: true,
      pointOfSale: true,
    }
  });

  // Modal and popover states
  const [modalActive, setModalActive] = useState(false);
  const [popoverActive, setPopoverActive] = useState(false);

  // Form state for modal
  const [formData, setFormData] = useState({
    name: optionSet.title,
    status: optionSet.status,
    onlineStore: optionSet.salesChannels.onlineStore,
    pointOfSale: optionSet.salesChannels.pointOfSale,
  });

  // Modal handlers
  const handleModalOpen = useCallback(() => {
    setFormData({
      name: optionSet.title,
      status: optionSet.status,
      onlineStore: optionSet.salesChannels.onlineStore,
      pointOfSale: optionSet.salesChannels.pointOfSale,
    });
    setModalActive(true);
    setPopoverActive(false);
  }, [optionSet]);

  const handleModalClose = useCallback(() => {
    setModalActive(false);
  }, []);

  const handleSave = useCallback(() => {
    // Update the option set with form data
    setOptionSet({
      title: formData.name,
      status: formData.status,
      salesChannels: {
        onlineStore: formData.onlineStore,
        pointOfSale: formData.pointOfSale,
      }
    });
    setModalActive(false);
    // You can add API call here to save data
    console.log('Saved data:', formData);
  }, [formData]);

  // Popover handlers
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  // Form handlers
  const handleNameChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, name: value }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, status: value }));
  }, []);

  const handleOnlineStoreChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, onlineStore: value }));
  }, []);

  const handlePointOfSaleChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, pointOfSale: value }));
  }, []);

  // Action list items
  const actionItems = [
    {
      content: 'Manage option set',
      onAction: handleModalOpen,
    },
    {
      content: 'Duplicate',
      onAction: () => {
        setPopoverActive(false);
        console.log('Duplicate action');
      },
    },
    {
      content: 'Delete',
      destructive: true,
      onAction: () => {
        setPopoverActive(false);
        console.log('Delete action');
      },
    },
  ];

  // Status options for select
  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
  ];

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack wrap={false} gap="400">
                <Text variant="bodyLg" as="h4" fontWeight="semibold">
                  {optionSet.title}
                </Text>
                <Badge
                  progress={optionSet.status === "Active" ? "complete" : "incomplete"}
                  tone={optionSet.status === "Active" ? "success" : undefined}
                >
                  {optionSet.status}
                </Badge>
              </InlineStack>
              
              {/* Menu Button */}
              <Popover
                active={popoverActive}
                activator={
                  <Button
                    variant="tertiary"
                    onClick={togglePopoverActive}
                    icon={MenuHorizontalIcon}
                    accessibilityLabel="More actions"
                  />
                }
                onClose={togglePopoverActive}
              >
                <ActionList items={actionItems} />
              </Popover>
            </InlineStack>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Manage Option Set Modal */}
      <Modal
        open={modalActive}
        onClose={handleModalClose}
        title="Manage option set"
        primaryAction={{
          content: 'Save',
          onAction: handleSave,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleModalClose,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            {/* Name Field */}
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleNameChange}
              autoComplete="off"
            />

            {/* Status Field */}
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={handleStatusChange}
            />

            {/* Sales Channels */}
            <Box>
              <Text variant="bodyMd" fontWeight="medium" as="p">
                Sales channels
              </Text>
              <Box paddingBlockStart="200">
                <BlockStack gap="200">
                  <Checkbox
                    label="Online Store"
                    checked={formData.onlineStore}
                    onChange={handleOnlineStoreChange}
                  />
                  <Checkbox
                    label="Point of Sale"
                    checked={formData.pointOfSale}
                    onChange={handlePointOfSaleChange}
                  />
                </BlockStack>
              </Box>
            </Box>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}