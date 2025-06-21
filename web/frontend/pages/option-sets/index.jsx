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
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Tab management
  const [itemStrings, setItemStrings] = useState(["All", "Active", "Draft"]);
  const [selected, setSelected] = useState(0);

  // Search and filters
  const [queryValue, setQueryValue] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);

  // Table sorting
  const [sortDirection, setSortDirection] = useState("descending");
  const [sortColumn, setSortColumn] = useState(3);
  const [sortSelected, setSortSelected] = useState(["date desc"]);

  // Modal states
  const [popoverActive, setPopoverActive] = useState(false);

  const { mode, setMode } = useSetIndexFiltersMode();

  const togglePopoverActive = useCallback(
    () => setPopoverActive((active) => !active),
    []
  );

  const handleAction = useCallback((action) => {
    setPopoverActive(false);
    navigate(action);
  }, [navigate]);

  const handleExportAction = () => {
    alert("Export option sets");
  };

  const handleImportAction = () => {
    alert("Import option sets");
  };

  // Tab configuration
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  // Sort options
  const sortOptions = [
    { label: "Name", value: "name asc", directionLabel: "A-Z" },
    { label: "Name", value: "name desc", directionLabel: "Z-A" },
    { label: "Status", value: "status asc", directionLabel: "A-Z" },
    { label: "Status", value: "status desc", directionLabel: "Z-A" },
    {
      label: "Sales channels",
      value: "channels asc",
      directionLabel: "Ascending",
    },
    {
      label: "Sales channels",
      value: "channels desc",
      directionLabel: "Descending",
    },
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

  // Filter handlers
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );

  const handleStatusFilterChange = useCallback(
    (value) => setStatusFilter(value),
    []
  );

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

  const handleStatusFilterRemove = useCallback(() => setStatusFilter([]), []);

  const handleFiltersClearAll = useCallback(() => {
    setQueryValue("");
    setStatusFilter([]);
  }, []);

  // Sort handler
  const handleSortChange = useCallback((value) => {
    setSortSelected(value);
    // Update internal sorting state based on selection
    const sortValue = value[0];
    if (sortValue.includes("name")) {
      setSortColumn(0);
      setSortDirection(sortValue.includes("asc") ? "ascending" : "descending");
    } else if (sortValue.includes("status")) {
      setSortColumn(1);
      setSortDirection(sortValue.includes("asc") ? "ascending" : "descending");
    } else if (sortValue.includes("channels")) {
      setSortColumn(2);
      setSortDirection(sortValue.includes("asc") ? "ascending" : "descending");
    } else if (sortValue.includes("date")) {
      setSortColumn(3);
      setSortDirection(sortValue.includes("asc") ? "ascending" : "descending");
    }
  }, []);

  // Filters configuration
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

  // Applied filters
  const appliedFilters = [];

  if (queryValue && queryValue !== "") {
    appliedFilters.push({
      key: "query",
      label: `Name: ${queryValue}`,
      onRemove: handleQueryValueRemove,
    });
  }

  if (statusFilter && statusFilter.length > 0) {
    appliedFilters.push({
      key: "status",
      label: `Status: ${statusFilter.join(", ")}`,
      onRemove: handleStatusFilterRemove,
    });
  }

  // Helper function to check if array/string is empty
  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  };

  // Data filtering logic
  let filteredRows = allRows.filter((row) =>
    row.name.toLowerCase().includes(queryValue.toLowerCase())
  );

  // Tab filtering
  if (selected === 1) {
    filteredRows = filteredRows.filter((row) => row.status === "Active");
  } else if (selected === 2) {
    filteredRows = filteredRows.filter((row) => row.status === "Draft");
  }

  // Status filter
  if (statusFilter && statusFilter.length > 0) {
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

  return (
    <Page>
      {/* Header Section */}
      <Box paddingBlockEnd="600">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingLg" as="h1">
            Option Sets
          </Text>
          <InlineStack gap="300">
            <Button onClick={handleExportAction} disabled>Export option sets</Button>
            <Button onClick={handleImportAction} disabled>Import option sets</Button>
            <Popover
              active={popoverActive}
              activator={
                <Button
                  onClick={togglePopoverActive}
                  disclosure
                  variant="primary"
                >
                  Create option set
                </Button>
              }
              onClose={togglePopoverActive}
            >
              <ActionList
                items={[
                  {
                    content: "Create from scratch",
                    onAction: () => handleAction("/option-sets/new"),
                  },
                  {
                    content: "Use a template",
                    onAction: () => handleAction("/option-sets/templates"),
                  },
                ]}
              />
            </Popover>
          </InlineStack>
        </InlineStack>
      </Box>

      {/* Filters and Table */}
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Search by name"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={handleQueryValueRemove}
        cancelAction={() => setQueryValue("")}
        onSort={handleSortChange}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView={false}
        filters={filters}
        appliedFilters={appliedFilters}
        onClearAll={handleFiltersClearAll}
        mode={mode}
        setMode={setMode}
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
                <Badge tone={status === "Active" ? "success" : undefined}>
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
    </Page>
  );
}
