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
  Card,
  InlineStack,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useAppBridge, TitleBar } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";

import { sortOptions } from "../../helpers";

export default function OptionSets() {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  // table data
  const [optionSets, setOptionSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleAction = useCallback(
    (action) => {
      setPopoverActive(false);
      navigate(action);
    },
    [navigate]
  );

  const fetchOptionSets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/option-set");
      const data = await response?.json();
      if (response.ok) {
        setOptionSets(data);
      } else {
        setOptionSets([]);
        shopify?.toast?.show(data?.error || "Failed to load option sets.", {
          isError: true,
        });
        setError(data?.error || "Failed to load option sets.");
      }
    } catch {
      shopify?.toast?.show("Failed to load option sets.", { isError: true });
      setError("Failed to load option sets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptionSets();
  }, []);

  // Tab configuration
  const tabs = ["All", "Active", "Draft"].map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  // Filter handlers
  const handleFiltersQueryChange = useCallback((v) => setQueryValue(v), []);

  const handleStatusFilterChange = useCallback((v) => setStatusFilter(v), []);

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

  // Data filtering logic
  let filteredRows = optionSets.filter((row) =>
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
        aValue = a.sales_channels;
        bValue = b.sales_channels;
        break;
      case 3:
        aValue = a.created_at;
        bValue = b.created_at;
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
      <TitleBar title={"Option Sets"} />

      {/* Header Section */}
      <Box paddingBlockEnd="600">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingLg" as="h1">
            Option Sets
          </Text>
          <InlineStack gap="300">
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
      <Card padding="0">
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
          loading={loading}
          onSelectionChange={handleSelectionChange}
          sortDirection={sortDirection}
          sortColumnIndex={sortColumn}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          headings={[
            { title: "Name", sortable: true },
            { title: "Status", sortable: true },
            { title: "Sales channels", sortable: true },
            { title: "Date created", sortable: true },
          ]}
          onSort={(columnIndex, direction) => {
            setSortColumn(columnIndex);
            setSortDirection(direction);
          }}
        >
          {filteredRows.map(
            ({ id, name, status, sales_channels, created_at }, index) => (
              <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
              >
                <IndexTable.Cell>
                  <Button
                    variant="monochromePlain"
                    onClick={() => navigate(`/option-sets/${id}`)}
                  >
                    <Text variant="bodyMd" fontWeight="medium">
                      {name}
                    </Text>
                  </Button>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Badge tone={status === "Active" ? "success" : undefined}>
                    {status}
                  </Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text variant="bodyMd">
                    {Object.values(sales_channels || {}).filter(Boolean).length}
                  </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                  <Text variant="bodyMd" tone="subdued">
                    {created_at}
                  </Text>
                </IndexTable.Cell>
              </IndexTable.Row>
            )
          )}
        </IndexTable>
      </Card>
    </Page>
  );
}
