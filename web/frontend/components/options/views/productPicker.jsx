import {
  Modal,
  Text,
  ResourceList,
  ResourceItem,
  Thumbnail,
  TextField,
  Spinner,
  InlineStack,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { productsHook } from "../../../hooks";

export const ProductPicker = ({ open, onClose, onSelect }) => {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const { products, loading, fetchProducts } = productsHook();

  useEffect(() => {
    if (open) fetchProducts(search);
  }, [open, search, fetchProducts]);

  const handleSelection = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Select products"
      primaryAction={{
        content: "Select",
        onAction: handleSelection,
      }}
      secondaryActions={[{ content: "Cancel", onAction: onClose }]}
    >
      <Modal.Section>
        <TextField
          value={search}
          onChange={setSearch}
          placeholder="Search products"
        />
      </Modal.Section>
      <Modal.Section>
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px auto" }}>
            <Spinner accessibilityLabel="Loading products" size="large" />
          </div>
        ) : (
          <ResourceList
            resourceName={{ singular: "product", plural: "products" }}
            items={products}
            selectedItems={selected}
            onSelectionChange={setSelected}
            selectable
            renderItem={(item) => {
              const { id, title, image } = item;
              return (
                <ResourceItem id={id} accessibilityLabel={`Select ${title}`}>
                  <InlineStack wrap={false} gap="400" blockAlign="center">
                    {image ? (
                      <Thumbnail
                        source={image || ""}
                        alt={title}
                        size="small"
                      />
                    ) : (
                      <Thumbnail source={ImageIcon} size="small" />
                    )}
                    <Text fontWeight="medium">{title}</Text>
                  </InlineStack>
                </ResourceItem>
              );
            }}
          />
        )}
      </Modal.Section>
    </Modal>
  );
};
