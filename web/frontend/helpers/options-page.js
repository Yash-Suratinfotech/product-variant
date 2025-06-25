// Sort options
export const sortOptions = [
  { label: "Name", value: "name asc", directionLabel: "A-Z" },
  { label: "Name", value: "name desc", directionLabel: "Z-A" },
  {
    label: "Date created",
    value: "date asc",
    directionLabel: "Oldest to newest",
  },
  {
    label: "Date created",
    value: "date desc",
    directionLabel: "Newest to oldest",
  },
];

// Mock elements data
export const mockElements = [
  {
    groupId: "group-1",
    id: "select-1",
    type: "select",
    position: 1,
    config: {
      label: "Select Field",
      name: "select",
      placeholder: "Enter select",
      helpText: "This is a select field",
      isRequired: true,
      defaultValue: "Default text here",
      className: "custom-select",
      columnWidth: "100%",
    },
  },
  {
    groupId: "group-1",
    id: "checkbox-1",
    type: "checkbox",
    position: 2,
    config: {
      label: "Checkbox",
      name: "checkbox",
      placeholder: "",
      helpText: "This is a checkbox field",
      isRequired: false,
      defaultValue: false,
      className: "custom-checkbox",
      columnWidth: "100%",
    },
  },
  {
    groupId: "group-1",
    id: "textarea-1",
    type: "textarea",
    position: 3,
    config: {
      label: "Textarea Field",
      name: "textarea_field",
      placeholder: "Enter textarea",
      helpText: "This is a textarea field",
      isRequired: true,
      defaultValue: "Default text here",
      className: "custom-textarea",
      columnWidth: "100%",
    },
  },
];
