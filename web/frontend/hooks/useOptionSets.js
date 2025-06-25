import { useState, useCallback } from "react";

export const useOptionSets = (shopify) => {
  const [optionSets, setOptionSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // get option set list
  const fetchOptionSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOptionSets([]);

    try {
      const response = await fetch("/api/option-set");

      if (response?.ok) {
        const data = await response.json();
        setOptionSets(data || []);
      } else {
        throw new Error(data?.error || "Error fetching option sets");
      }
    } catch (err) {
      const message = err.message || "Error fetching option sets";
      setError(message);
      shopify?.toast?.show(message, { isError: true });
    } finally {
      setLoading(false);
    }
  }, [shopify]);

  // add option set data
  const createOptionSets = useCallback(async (data) => {
    setLoading(true);
    setError(true);

    try {
      const response = await fetch("/api/option-set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("✌️response --->", response);

      if (response?.ok) {
        shopify.toast.show("Option set created successfully");
      } else {
        shopify.toast.show("There was an error creating the option set", {
          isError: true,
        });
      }
    } catch (err) {
      const message = err.message || "Error fetching option sets";
      setError(message);
      shopify?.toast?.show(message, { isError: true });
    } finally {
      setLoading(false);
    }
  });

  return {
    optionSets,
    loading,
    error,
    fetchOptionSets,
    createOptionSets,
  };
};
