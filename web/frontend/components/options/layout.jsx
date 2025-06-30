import {
  Page,
  Grid,
  SkeletonDisplayText,
  SkeletonBodyText,
  Box,
  Button,
  InlineGrid,
  Scrollable,
  BlockStack,
  InlineStack,
  Tooltip,
} from "@shopify/polaris";
import {
  LayoutBuyButtonIcon,
  ProductIcon,
  PersonIcon,
} from "@shopify/polaris-icons";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Section } from "./section";
import { Header } from "./header";
import { Preview } from "./preview";
import { useOptionSet } from "../../components";

export function OptionLayout({ id }) {
  const navigate = useNavigate();
  const { loading, getOptionSet } = useOptionSet();

  useEffect(() => {
    if (id == "undefined") {
      navigate("/option-sets");
    } else if (id !== undefined && id !== null) {
      getOptionSet(id);
    }
  }, [id]);

  return (
    <div className="option-layout">
      <Page fullWidth>
        <div className="grid-container">
          <Grid
            columns={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2 }}
            areas={{
              xs: ["header", "element", "preview"],
              sm: ["header", "element", "preview"],
              md: ["header", "element", "preview"],
              lg: ["header header", "element preview"],
              xl: ["header header", "element preview"],
            }}
            gap={{ xs: 0, sm: 0, md: 0, lg: 0, xl: 0 }}
          >
            <Grid.Cell area="header">
              {loading ? (
                <Box
                  background="bg-surface"
                  borderBlockEndWidth="025"
                  borderColor="border"
                >
                  <Box padding="400">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="Polaris-SkeletonDisplayText__DisplayText"
                        style={{
                          width: "200px",
                          maxWidth: "200px",
                        }}
                      />
                      <div
                        className="Polaris-SkeletonDisplayText__DisplayText"
                        style={{
                          width: "100px",
                          maxWidth: "100px",
                        }}
                      />
                    </div>
                  </Box>
                </Box>
              ) : (
                <Header id={id} />
              )}
            </Grid.Cell>

            <Grid.Cell area="element">
              {loading ? (
                <Box
                  background="bg-surface"
                  borderInlineEndWidth="025"
                  borderColor="border"
                >
                  <InlineStack wrap={false}>
                    <Box
                      padding="300"
                      borderInlineEndWidth="025"
                      borderColor="border"
                    >
                      <BlockStack gap={300}>
                        <Tooltip content="Elements" dismissOnMouseOut>
                          <Button size="large" icon={LayoutBuyButtonIcon} />
                        </Tooltip>
                        <Tooltip content="Products" dismissOnMouseOut>
                          <Button size="large" icon={ProductIcon} />
                        </Tooltip>
                        <Tooltip content="Customers" dismissOnMouseOut>
                          <Button size="large" icon={PersonIcon} />
                        </Tooltip>
                      </BlockStack>
                    </Box>

                    <Box width="100%" padding="0">
                      <Box
                        padding="300"
                        borderBlockEndWidth="025"
                        borderColor="border"
                      >
                        <SkeletonDisplayText size="small" />
                      </Box>
                      <Scrollable
                        style={{ width: "100%", height: "calc(100vh - 149px)" }}
                      >
                        <Box padding="300">
                          <BlockStack gap="200">
                            <SkeletonDisplayText maxWidth="100%" />
                            <SkeletonDisplayText maxWidth="100%" />
                            <SkeletonDisplayText maxWidth="100%" />
                            <SkeletonDisplayText maxWidth="100%" />
                            <SkeletonDisplayText maxWidth="100%" />
                            <SkeletonDisplayText maxWidth="100%" />
                          </BlockStack>
                        </Box>
                      </Scrollable>
                    </Box>
                  </InlineStack>
                </Box>
              ) : (
                <Section />
              )}
            </Grid.Cell>

            <Grid.Cell area="preview">
              {loading ? (
                <Box background="bg-surface">
                  <Scrollable
                    style={{ width: "100%", height: "calc(100vh - 105px)" }}
                  >
                    <Box padding="300">
                      <InlineGrid columns="auto 1fr" gap={500}>
                        <div
                          className="Polaris-SkeletonDisplayText__DisplayText"
                          style={{
                            width: "200px",
                            maxWidth: "200px",
                            height: "200px",
                          }}
                        ></div>
                        <BlockStack gap={300}>
                          <SkeletonDisplayText />
                          <SkeletonBodyText />
                        </BlockStack>
                      </InlineGrid>
                    </Box>
                  </Scrollable>
                </Box>
              ) : (
                <Preview />
              )}
            </Grid.Cell>
          </Grid>
        </div>
      </Page>
    </div>
  );
}
