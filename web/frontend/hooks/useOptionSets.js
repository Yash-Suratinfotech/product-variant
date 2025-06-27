import { useState, useCallback } from "react";
import axios from "axios";

export const useOptionSets = (shopify) => {
  const [optionSets, setOptionSets] = useState([]);
  const [optionSet, setOptionSet] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // get option set list
  const fetchOptionSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOptionSets([]);

    try {
      const response = await axios.get("/api/option-set");
      setOptionSets(response.data || []);
    } catch (err) {
      console.log("✌️err --->", err);
      const message =
        err?.response?.data?.error ||
        err.message ||
        "Error fetching option sets";
      setError(message);
      shopify?.toast?.show(message, { isError: true });
    } finally {
      setLoading(false);
    }
  }, [shopify]);

  // add option set data
  const createOptionSets = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post("/api/option-set", data, {
          headers: { "Content-Type": "application/json" },
        });

        if (response?.status === 200 || response?.status === 201) {
          shopify?.toast?.show("Option set created successfully");
        } else {
          shopify?.toast?.show("There was an error creating the option set", {
            isError: true,
          });
        }
      } catch (err) {
        const message =
          err?.response?.data?.error ||
          err.message ||
          "Error creating option sets";
        setError(message);
        shopify?.toast?.show(message, { isError: true });
      } finally {
        setLoading(false);
      }
    },
    [shopify]
  );

  // get option set data
  const getOptionSet = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/option-set/${id}`);
        setOptionSet(response.data);
      } catch (err) {
        const message =
          err?.response?.data?.error ||
          err.message ||
          "Error fetching option set";
        setError(message);
        shopify?.toast?.show(message, { isError: true });
      } finally {
        setLoading(false);
      }
    },
    [shopify]
  );

  return {
    optionSets,
    optionSet,
    loading,
    error,
    fetchOptionSets,
    createOptionSets,
    getOptionSet,
  };
};
