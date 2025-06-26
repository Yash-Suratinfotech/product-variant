import {
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
} from "@shopify/polaris";
import { MenuHorizontalIcon, ArrowLeftIcon } from "@shopify/polaris-icons";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useOptionSets } from "../../hooks";
// import { mockElements } from "../../helpers";
import { useOptionSet } from "../../components";

export function Header({ id }) {
  const navigate = useNavigate();
  const { elements } = useOptionSet();

  const { loading, createOptionSets } = useOptionSets(shopify);

  // State for option set data
  const [optionSet, setOptionSet] = useState({
    title: "New Option Set",
    status: "Active",
    salesChannels: {
      onlineStore: true,
      pointOfSale: false,
    },
  });

  // Modal and popover states
  const [modalActive, setModalActive] = useState(false);

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
      },
    });
    setModalActive(false);

    // You can add API call here to save data
    console.log("Saved data:", formData);
  }, [formData]);

  // Form handlers
  const handleNameChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, name: value }));
  }, []);

  const handleStatusChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  }, []);

  const handleOnlineStoreChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, onlineStore: value }));
  }, []);

  const handlePointOfSaleChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, pointOfSale: value }));
  }, []);

  const handleCreate = async () => {
    const data = {
      name: optionSet.title,
      status: optionSet.status,
      is_template: false,
      sales_channels: optionSet.salesChannels,
      fields: elements,
    };
    const response = await createOptionSets(data);

    if (response?.ok) {
      navigate(`/option-sets/${data.id}`);
    }
  };

  // Status options for select
  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Draft", value: "Draft" },
  ];

  return (
    <Box background="bg-surface" borderBlockEndWidth="025" borderColor="border">
      <Box padding="400">
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack wrap={false} gap="400" align="center">
            <Button
              variant="tertiary"
              icon={ArrowLeftIcon}
              accessibilityLabel="Back to option sets"
              onClick={() => navigate(`/option-sets`)}
            />
            <Text variant="bodyLg" as="h4" fontWeight="semibold">
              {optionSet.title} {id ? `- ${id}` : ""}
            </Text>
            <Badge tone={optionSet.status === "Active" ? "success" : undefined}>
              {optionSet.status}
            </Badge>
            <Button
              variant="tertiary"
              onClick={handleModalOpen}
              icon={MenuHorizontalIcon}
              accessibilityLabel="More actions"
            />
          </InlineStack>

          <InlineStack gap="300">
            <Button onClick={handleCreate} loading={loading}>
              Save
            </Button>
          </InlineStack>
        </InlineStack>
      </Box>

      {/* Manage Option Set Modal */}
      <Modal
        open={modalActive}
        onClose={handleModalClose}
        title="Manage option set"
        primaryAction={{
          content: "Save",
          onAction: handleSave,
        }}
        secondaryActions={[
          {
            content: "Cancel",
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
                <BlockStack>
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
    </Box>
  );
}
