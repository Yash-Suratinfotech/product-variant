import { useState, useCallback } from "react";

export const productsHook = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products?title=${encodeURIComponent(search)}`);
      const data = await response.json();
      setProducts(data || []);
      return data || [];
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
};
