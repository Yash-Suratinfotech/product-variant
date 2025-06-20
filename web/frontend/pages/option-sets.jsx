import {
  Page,
  Text,
  Button,
  Popover,
  ActionList,
  IndexTable,
  useIndexResourceState,
  Badge,
  IndexFilters,
  useSetIndexFiltersMode,
  ChoiceList,
  Box,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

// CSS styles as a string for injection
const modernStyles = `
  /* Hide badges in IndexFilters tabs for clean design */
  .Polaris-IndexFilters .Polaris-Tabs .Polaris-Badge,
  .Polaris-IndexFilters-Tab .Polaris-Badge,
  .Polaris-Tabs-Tab .Polaris-Badge {
    display: none !important;
  }
  
  /* Clean tab styling */
  .Polaris-IndexFilters .Polaris-Tabs-Tab {
    font-weight: 500;
  }
  
  .Polaris-IndexFilters .Polaris-Tabs-Tab[aria-selected="true"] {
    font-weight: 600;
  }
  
  /* Modern table styling */
  .Polaris-IndexTable__TableHeading {
    font-weight: 600;
    color: var(--p-color-text-subdued);
    font-size: 0.875rem;
  }
  
  .Polaris-IndexTable__TableRow:hover {
    background-color: var(--p-color-bg-surface-hover);
  }
  
  /* Clean button styling */
  .Polaris-Button {
    font-weight: 500;
  }
  
  /* Modern IndexFilters styling */
  .Polaris-IndexFilters {
    background: var(--p-color-bg-surface);
    border: 1px solid var(--p-color-border);
    border-radius: var(--p-border-radius-200);
  }
  
  /* Clean IndexTable styling */
  .Polaris-IndexTable {
    border: 1px solid var(--p-color-border);
    border-radius: var(--p-border-radius-200);
    overflow: hidden;
  }
`;

const allRows = [
  {
    id: "1",
    name: "New Option Set",
    status: "Active",
    salesChannels: 2,
    dateCreated: "2025-06-20 05:32:18",
  },
  {
    id: "2",
    name: "demo",
    status: "Active",
    salesChannels: 1,
    dateCreated: "2025-06-19 11:10:36",
  },
  {
    id: "3",
    name: "test",
    status: "Active",
    salesChannels: 2,
    dateCreated: "2025-06-20 09:15:22",
  },
  {
    id: "4",
    name: "sample",
    status: "Draft",
    salesChannels: 3,
    dateCreated: "2025-06-21 14:30:45",
  },
  {
    id: "5",
    name: "example",
    status: "Draft",
    salesChannels: 4,
    dateCreated: "2025-06-22 16:45:10",
  },
];

export default function OptionSets() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [sortDirection, setSortDirection] = useState("descending");
  const [sortColumn, setSortColumn] = useState(3);
  const [popoverActive, setPopoverActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);

  const { mode, setMode } = useSetIndexFiltersMode();

  // Inject CSS styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = modernStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  const handleAction = (action) => {
    setPopoverActive(false);
    alert(`Selected: ${action}`);
  };

  const handleExportAction = () => {
    alert("Export option sets");
  };

  const handleImportAction = () => {
    alert("Import option sets");
  };

  // Clean tabs without badges for modern design
  const tabs = [
    { id: "all", content: "All" },
    { id: "active", content: "Active" },
    { id: "draft", content: "Draft" },
  ];

  // Filtering based on search query
  let filteredRows = allRows.filter((row) =>
    row.name.toLowerCase().includes(queryValue.toLowerCase())
  );

  // Tab filtering
  if (selectedTab === 1) {
    filteredRows = filteredRows.filter((row) => row.status === "Active");
  } else if (selectedTab === 2) {
    filteredRows = filteredRows.filter((row) => row.status === "Draft");
  }

  // Additional status filter from filter dropdown
  if (statusFilter.length > 0) {
    filteredRows = filteredRows.filter((row) =>
      statusFilter.includes(row.status)
    );
  }

  // Sorting
  filteredRows.sort((a, b) => {
    let aValue, bValue;
    switch (sortColumn) {
      case 0:
        aValue = a.name;
        bValue = b.name;
        break;
      case 1:
        aValue = a.status;
        bValue = b.status;
        break;
      case 2:
        aValue = a.salesChannels;
        bValue = b.salesChannels;
        break;
      case 3:
        aValue = a.dateCreated;
        bValue = b.dateCreated;
        break;
      default:
        return 0;
    }
    if (aValue < bValue) return sortDirection === "ascending" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "ascending" ? 1 : -1;
    return 0;
  });

  const resourceName = { singular: "option set", plural: "option sets" };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(filteredRows);

  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );

  const handleStatusFilterChange = useCallback(
    (value) => setStatusFilter(value),
    []
  );

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    setQueryValue("");
    setStatusFilter([]);
  }, []);

  const filters = [
    {
      key: "status",
      label: "Status",
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { label: "Active", value: "Active" },
            { label: "Draft", value: "Draft" },
          ]}
          selected={statusFilter}
          onChange={handleStatusFilterChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters = [];
  if (queryValue && queryValue !== "") {
    appliedFilters.push({
      key: "query",
      label: `Name: ${queryValue}`,
      onRemove: handleQueryValueRemove,
    });
  }
  if (statusFilter.length > 0) {
    appliedFilters.push({
      key: "status",
      label: `Status: ${statusFilter.join(", ")}`,
      onRemove: () => setStatusFilter([]),
    });
  }

  return (
    <Page>
      {/* Header Section */}
      <Box paddingBlockEnd="600">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingXl" as="h1">
            Option Sets
          </Text>
          <InlineStack gap="300">
            <Button onClick={handleExportAction}>
              Export option sets
            </Button>
            <Button onClick={handleImportAction}>
              Import option sets
            </Button>
            <Popover
              active={popoverActive}
              activator={
                <Button onClick={togglePopoverActive} disclosure variant="primary">
                  Create option set
                </Button>
              }
              onClose={togglePopoverActive}
            >
              <ActionList
                items={[
                  {
                    content: "Create from scratch",
                    onAction: () => handleAction("Create from scratch"),
                  },
                  {
                    content: "Use a template",
                    onAction: () => handleAction("Use a template"),
                  },
                ]}
              />
            </Popover>
          </InlineStack>
        </InlineStack>
      </Box>

      {/* Filters and Table */}
      <BlockStack gap="400">
        <IndexFilters
          sortOptions={[
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
          ]}
          sortSelected={["date desc"]}
          queryValue={queryValue}
          queryPlaceholder="Search by name"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
          tabs={tabs}
          selected={selectedTab}
          onSelect={setSelectedTab}
          canCreateNewView={false}
        />

        <IndexTable
          resourceName={resourceName}
          itemCount={filteredRows.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Name", sortable: true },
            { title: "Status", sortable: true },
            { title: "Sales channels", sortable: true },
            { title: "Date created", sortable: true },
          ]}
          sortDirection={sortDirection}
          sortColumnIndex={sortColumn}
          onSort={(columnIndex, direction) => {
            setSortColumn(columnIndex);
            setSortDirection(direction);
          }}
        >
          {filteredRows.map(
            ({ id, name, status, salesChannels, dateCreated }, index) => (
              <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
              >
                <IndexTable.Cell>
                  <Text variant="bodyMd" fontWeight="medium">
                    {name}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Badge tone={status === "Active" ? "success" : "info"}>
                    {status}
                  </Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text variant="bodyMd">{salesChannels}</Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text variant="bodyMd" tone="subdued">
                    {dateCreated}
                  </Text>
                </IndexTable.Cell>
              </IndexTable.Row>
            )
          )}
        </IndexTable>
      </BlockStack>
    </Page>
  );
}