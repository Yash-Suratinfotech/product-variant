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

import { useOptionSet } from "../../components";

export function Header({ id }) {
  const navigate = useNavigate();

  const {
    optionSet,
    setOptionSet,
    elements,
    loading,
    createOptionSets,
    updateOptionSet,
  } = useOptionSet();

  // Modal and popover states
  const [modalActive, setModalActive] = useState(false);

  // Form state for modal
  const [formData, setFormData] = useState({
    name: optionSet.name,
    status: optionSet.status,
    onlineStore: optionSet.sales_channels?.onlineStore,
    pointOfSale: optionSet.sales_channels?.pointOfSale,
  });

  // Modal handlers
  const handleModalOpen = useCallback(() => {
    setFormData({
      name: optionSet.name,
      status: optionSet.status,
      onlineStore: optionSet.sales_channels?.onlineStore,
      pointOfSale: optionSet.sales_channels?.pointOfSale,
    });
    setModalActive(true);
  }, [optionSet]);

  const handleModalClose = useCallback(() => {
    setModalActive(false);
  }, []);

  const handleSave = useCallback(() => {
    // Update the option set with form data
    setOptionSet({
      name: formData.name,
      status: formData.status,
      sales_channels: {
        onlineStore: formData.onlineStore,
        pointOfSale: formData.pointOfSale,
      },
    });
    setModalActive(false);
  }, [formData]);

  // Form handlers
  const handleFormChange = useCallback(
    (field) => (value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCreate = async () => {
    const payload = {
      name: optionSet.name,
      status: optionSet.status,
      is_template: false,
      sales_channels: optionSet.sales_channels,
      fields: elements,
    };
    await createOptionSets(payload);
  };

  const handleUpdate = async () => {
    const data = {
      name: optionSet.name,
      status: optionSet.status,
      is_template: false,
      sales_channels: optionSet.sales_channels,
      fields: elements,
    };
    await updateOptionSet(id, data);
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
              {optionSet.name}
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
            <Button
              onClick={id == undefined ? handleCreate : handleUpdate}
              loading={loading}
            >
              {id == undefined ? "Create" : "Update"} Option Set
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
              onChange={handleFormChange("name")}
              autoComplete="off"
            />

            {/* Status Field */}
            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={handleFormChange("status")}
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
                    onChange={handleFormChange("onlineStore")}
                  />
                  <Checkbox
                    label="Point of Sale"
                    checked={formData.pointOfSale}
                    onChange={handleFormChange("pointOfSale")}
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
