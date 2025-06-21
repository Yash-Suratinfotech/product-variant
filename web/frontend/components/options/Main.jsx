import { Page, Grid } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import React from "react";

import { ElementMain } from "./ElementMain";
import { Header } from "./Header";
import { Preview } from "./Preview";

export function OptionLayout({ id }) {
  return (
    <div className="option-layout">
      <Page fullWidth>
        <TitleBar title={"Product Variant"} />
        <div className="grid-container">
          <Grid
            columns={{
              md: 1,
              xl: 2,
            }}
            areas={{
              md: ["header", "element", "preview"],
              xl: ["header header", "element preview"],
            }}
            gap={{ md: 0, xl: 0 }}
          >
            <Grid.Cell area="header">
              <Header id={id} />
            </Grid.Cell>

            <Grid.Cell area="element">
              <ElementMain />
            </Grid.Cell>

            <Grid.Cell area="preview">
              <Preview />
            </Grid.Cell>
          </Grid>
        </div>
      </Page>
    </div>
  );
}
