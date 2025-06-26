// components/ElementsProvider.jsx
import React, { createContext, useContext, useState } from "react";

const OptionSetContext = createContext();

export const OptionSetProvider = ({ children }) => {
  const [selectedOptionSet, setSelectedOptionSet] = useState(null);
  const [elements, setElements] = useState([]);

  return (
    <OptionSetContext.Provider
      value={{ selectedOptionSet, setSelectedOptionSet, elements, setElements }}
    >
      {children}
    </OptionSetContext.Provider>
  );
};

export const useOptionSet = () => useContext(OptionSetContext);
