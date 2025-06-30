import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  InlineGrid,
  Banner,
  InlineStack,
  SkeletonBodyText,
  SkeletonDisplayText,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { SetupGuide } from "./../components";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storeRes, statsRes] = await Promise.all([
        fetch("/api/store/info"),
        fetch("/api/store/stats"),
      ]);

      if (storeRes.ok && statsRes.ok) {
        const storeInfoData = await storeRes.json();
        const statsData = await statsRes.json();
        setStoreInfo(storeInfoData);
        setStats(statsData);

        // Calculate setup Items
        setItems([
          {
            id: 0,
            title: "Add products to your store",
            description:
              "Add your first product to start selling. Easily manage your inventory and showcase your products to customers.",
            image: {
              url: "https://cdn.shopify.com/shopifycloud/shopify/assets/admin/home/onboarding/shop_pay_task-70830ae12d3f01fed1da23e607dc58bc726325144c29f96c949baca598ee3ef6.svg",
              alt: "Illustration highlighting ShopPay integration",
            },
            complete: statsData.products > 0,
            primaryButton: {
              content: "Add product",
              props: {
                url: `https://admin.shopify.com/store/${
                  storeInfoData?.domain?.split(".")[0]
                }/products/new`,
                external: false,
              },
            },
            secondaryButton: {
              content: "Import products",
              props: {
                url: `https://admin.shopify.com/store/${
                  storeInfoData?.domain?.split(".")[0]
                }/products?modal=import`,
                external: false,
              },
            },
          },
          {
            id: 1,
            title: "Create your first option set",
            description:
              "Create option sets to offer customizable choices (like size, color, or material) for your products and enhance your customers' shopping experience.",
            complete: statsData.option_sets > 0,
            primaryButton: {
              content: "Create option set",
              props: {
                onClick: () => handleAction("/option-sets/new"),
              },
            },
            secondaryButton: {
              content: "View all option sets",
              props: {
                onClick: () => handleAction("/option-sets"),
              },
            },
          },
          {
            id: 2,
            title: "Get your first order",
            description:
              "Promote your store and start selling! Share your products, engage with customers, and watch your first order come in.",
            complete: statsData.orders > 0,
          },
        ]);
      }
    } catch (error) {
      shopify.toast.show("There was an error fetching store data", {
        isError: true,
      });
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = useCallback(
    (action) => {
      navigate(action);
    },
    [navigate]
  );

  if (loading) {
    return (
      <Page>
        <TitleBar title="Product Variant" />
        <Layout>
          {/* Welcome Banner */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Setup Guide */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={6} />
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Stats Grid */}
          <Layout.Section>
            <InlineGrid columns="2" gap="400">
              <Card>
                <BlockStack gap="200">
                  <SkeletonDisplayText size="large" />
                  <SkeletonBodyText lines={1} />
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <SkeletonDisplayText size="large" />
                  <SkeletonBodyText lines={1} />
                </BlockStack>
              </Card>
            </InlineGrid>
          </Layout.Section>

          {/* Current Plan */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Quick Actions */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Help Section */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const StatCard = ({ title, value, suffix = "" }) => (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingMd" color="subdued">
          {title}
        </Text>
        <Text variant="displayLarge">
          {value}
          {suffix}
        </Text>
      </BlockStack>
    </Card>
  );

  return (
    <Page>
      <TitleBar title="Product Variant" />
      <Layout>
        {/* Welcome Banner */}
        <Layout.Section>
          <Banner
            title={`Hello, ${
              storeInfo?.shop_owner || storeInfo?.name || "there"
            }!`}
            status="info"
            onDismiss={() => {}}
          >
            <p>
              Welcome to <strong>Product Variants</strong>, handcrafted by Surat
              Infotech.
            </p>
          </Banner>
        </Layout.Section>

        {/* Setup Guide */}
        <Layout.Section>
          <SetupGuide items={items} />
        </Layout.Section>

        {/* Stats Grid */}
        <Layout.Section>
          <InlineGrid columns="2" gap="400">
            <StatCard
              title="Active products"
              value={stats?.products || 0}
              suffix={` / ${stats?.products || 0} total products`}
            />
            <StatCard title="Option sets" value={stats?.option_sets || 0} />
          </InlineGrid>
        </Layout.Section>

        {/* Current Plan */}
        <Layout.Section>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd">Current plan</Text>
              <Text color="subdued">
                You are currently on a{" "}
                <b>{storeInfo?.plan_display_name || "development"}</b> plan
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Help Section */}
        <Layout.Section secondary>
          <Card>
            <BlockStack gap="200">
              <Text variant="headingMd">Need help setting up your app?</Text>
              <Text color="subdued">
                Our support team is ready to help with our in-app live chat.
              </Text>
              <InlineStack>
                <Button>Chat with us</Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
