import {
  Card,
  Page,
  Layout,
  Text,
  Image,
  InlineStack,
  BlockStack,
  Link,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page narrowWidth>
      <TitleBar title={"Product Variant"} />
      <Layout>
        <Layout.Section>
          <Card>
            <InlineStack
              wrap={false}
              gap="400"
              align="space-between"
              blockAlign="center"
            >
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  {t("HomePage.heading")}
                </Text>
                <Text as="p">
                  <Trans
                    i18nKey="HomePage.yourAppIsReadyToExplore"
                    components={{
                      PolarisLink: (
                        <Link url="https://polaris.shopify.com/" external />
                      ),
                      AdminApiLink: (
                        <Link
                          url="https://shopify.dev/api/admin-graphql"
                          external
                        />
                      ),
                      AppBridgeLink: (
                        <Link
                          url="https://shopify.dev/apps/tools/app-bridge"
                          external
                        />
                      ),
                    }}
                  />
                </Text>
                <Text as="p">{t("HomePage.startPopulatingYourApp")}</Text>
                <Text as="p">
                  <Trans
                    i18nKey="HomePage.learnMore"
                    components={{
                      ShopifyTutorialLink: (
                        <Link
                          url="https://shopify.dev/apps/getting-started/add-functionality"
                          external
                        />
                      ),
                    }}
                  />
                </Text>
              </BlockStack>
              <Box padding="400">
                <Image
                  source={trophyImage}
                  alt={t("HomePage.trophyAltText")}
                  width={120}
                />
              </Box>
            </InlineStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
