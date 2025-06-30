import { FormLayout, TextField, Grid, Checkbox } from "@shopify/polaris";
import React from "react";
import { useOptionSet } from "../../../components";

export function ElementsSettingsView() {
  const { element, setElement, updateElementInElements } = useOptionSet();

  // Handlers
  const handleChange = (field) => (value) => {
    const updated = {
      ...element,
      config: { ...element.config, [field]: value },
    };
    setElement(updated);
    updateElementInElements(updated);
  };
  const handleCheck = (field) => (checked) => {
    const updated = {
      ...element,
      config: { ...element.config, [field]: checked },
    };
    setElement(updated);
    updateElementInElements(updated);
  };

  return (
    <FormLayout>
      <Grid gap={{ xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <TextField
            label="Label"
            value={element?.config?.label || ""}
            onChange={handleChange("label")}
            autoComplete="off"
            requiredIndicator
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <TextField
            label="Name"
            value={element?.config?.name || ""}
            onChange={handleChange("name")}
            autoComplete="off"
            requiredIndicator
          />
        </Grid.Cell>
      </Grid>

      <Grid gap={{ xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Checkbox
            label="Required field"
            checked={element?.config?.isRequired || false}
            onChange={handleCheck("isRequired")}
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Checkbox
            label="Hidden label"
            checked={element?.config?.hiddenLabel || false}
            onChange={handleCheck("hiddenLabel")}
          />
        </Grid.Cell>
      </Grid>

      <Grid gap={{ xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }}>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <TextField
            label="Placeholder"
            value={element?.config?.placeholder || ""}
            onChange={handleChange("placeholder")}
            autoComplete="off"
          />  
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <TextField
            label="Help text"
            value={element?.config?.helpText || ""}
            onChange={handleChange("helpText")}
            autoComplete="off"
          />
        </Grid.Cell>
      </Grid>
    </FormLayout>
  );
}
