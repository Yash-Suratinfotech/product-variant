// components/OptionSetProvider.jsx
import React, { createContext, useContext, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";

const OptionSetContext = createContext();

export const OptionSetProvider = ({ children }) => {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const NewOptionData = {
    name: "New Option Set",
    status: "Active",
    sales_channels: {
      onlineStore: true,
      pointOfSale: false,
    },
  };

  const [optionSet, setOptionSet] = useState(NewOptionData);
  const [selectedOptionSet, setSelectedOptionSet] = useState(null);
  const [elements, setElements] = useState([]);
  const [element, setElement] = useState(null);

  const updateElementInElements = (updatedElement) => {
    setElements((prev) =>
      prev.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id != id));
    if (element?.id == id) {
      setElement(null);
    }
  };

  const duplicateElement = (id) => {
    const elementToDuplicate = elements.find((el) => el.id === id);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: `${elementToDuplicate.type}-${Date.now()}`,
        position: elements.length,
        config: {
          ...elementToDuplicate.config,
          label: `${elementToDuplicate.config.label} Copy`,
          name: `${elementToDuplicate.type}-${elements.length}`,
        },
      };
      setElements((prev) => [...prev, newElement]);
      setElement(newElement);
    } else {
      shopify?.toast?.show("Element to duplicate not found", {
        isError: true,
      });
    }
  };

  // Function to create a new option set
  const createOptionSets = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/option-set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response?.json();
      if (response.ok) {
        shopify?.toast?.show("Option set created successfully");
        navigate(`/option-sets/${data.id}`);
      } else {
        shopify?.toast?.show(data?.error || "Error creating option set", {
          isError: true,
        });
        setError(data?.error || "Error creating option set");
      }
      return response;
    } catch {
      shopify?.toast?.show("Error creating option set", { isError: true });
      setError("Error creating option set");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch an option set by ID
  const getOptionSet = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/option-set/${id}`);
      const data = await response?.json();
      if (response.ok) {
        const optionSetData = {
          name: data?.name,
          status: data?.status,
          sales_channels: {
            onlineStore: data?.sales_channels?.onlineStore,
            pointOfSale: data?.sales_channels?.pointOfSale,
          },
          all_product: data?.all_product || false,
          products: data?.products || [],
        };
        setOptionSet(optionSetData);

        const elementsData = data?.fields;
        setElements(elementsData || []);
      } else {
        shopify?.toast?.show(data?.error || "Error fetching option set", {
          isError: true,
        });
        setError(data?.error || "Error fetching option set");
      }
    } catch {
      shopify?.toast?.show("Error fetching option set", { isError: true });
      setError("Error fetching option set");
    } finally {
      setLoading(false);
    }
  };

  // Function to update an existing option set
  const updateOptionSet = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/option-set/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response?.json();
      if (response.ok) {
        shopify?.toast?.show("Option set updated successfully");
      } else {
        shopify?.toast?.show(data?.error || "Error updating option set", {
          isError: true,
        });
        setError(data?.error || "Error updating option set");
      }
    } catch {
      shopify?.toast?.show("Error updating option set", { isError: true });
      setError("Error updating option set");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OptionSetContext.Provider
      value={{
        optionSet,
        setOptionSet,
        selectedOptionSet,
        setSelectedOptionSet,
        elements,
        setElements,
        element,
        setElement,
        updateElementInElements,
        deleteElement,
        duplicateElement,
        createOptionSets,
        getOptionSet,
        updateOptionSet,
        loading,
        error,
      }}
    >
      {children}
    </OptionSetContext.Provider>
  );
};

export const useOptionSet = () => useContext(OptionSetContext);
