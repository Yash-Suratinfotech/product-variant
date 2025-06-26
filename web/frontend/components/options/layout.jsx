import { Page, Grid } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React from "react";

import { Section } from "./section";
import { Header } from "./header";
import { Preview } from "./preview";
import { OptionSetProvider } from "../../components";

export function OptionLayout({ id }) {
  return (
    <div className="option-layout">
      <OptionSetProvider>
        <Page fullWidth>
          <TitleBar title={"Product Variant"} />
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
                <Header id={id} />
              </Grid.Cell>

              <Grid.Cell area="element">
                <Section />
              </Grid.Cell>

              <Grid.Cell area="preview">
                <Preview />
              </Grid.Cell>
            </Grid>
          </div>
        </Page>
      </OptionSetProvider>
    </div>
  );
}
