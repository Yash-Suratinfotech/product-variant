// components/OptionSetProvider.jsx
import React, { createContext, useContext, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

const OptionSetContext = createContext();

export const OptionSetProvider = ({ children }) => {
  const shopify = useAppBridge();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [selectionProduct, setSelectionProduct] = useState(false);
  const [automaticRulesActive, setAutomaticRulesActive] = useState(false);
  const [allProduct, setAllProduct] = useState(false);

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

  const fetchProducts = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/products?title=${encodeURIComponent(search)}`
      );
      const data = await response.json();
      setProducts(data || []);
      return data || [];
    } catch (err) {
      shopify?.toast?.show("Error fetching products !!", { isError: true });
      setError("Failed to load products.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProductSetContext.Provider
      value={{
        loading,
        error,
        products,
        setProducts,
        selectedProducts,
        setSelectedProducts,
        selectionProduct,
        setSelectionProduct,
        automaticRulesActive,
        setAutomaticRulesActive,
        allProduct,
        setAllProduct,
        handleManualToggle,
        handleAutomaticToggle,
        handleApplyAllToggle,
        fetchProducts,
      }}
    >
      {children}
    </ProductSetContext.Provider>
  );
};

export const useProductSet = () => useContext(OptionSetContext);
