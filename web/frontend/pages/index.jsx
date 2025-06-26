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
  ProgressBar,
  List,
  SkeletonBodyText,
  SkeletonDisplayText,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const [loading, setLoading] = useState(true);
  const [storeInfo, setStoreInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [setupProgress, setSetupProgress] = useState(0);

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
        setStoreInfo(await storeRes.json());
        const statsData = await statsRes.json();
        setStats(statsData);

        // Calculate setup progress
        const steps = [
          statsData.products > 0,
          statsData.option_sets > 0,
          statsData.orders > 0,
        ];
        const completed = steps.filter(Boolean).length;
        setSetupProgress((completed / 3) * 100);
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
          <Card>
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text variant="headingMd">Setup guide</Text>
                <Text color="subdued">
                  Use this personalized guide to set up product variants for
                  your store.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <InlineStack align="space-between">
                  <Text>{Math.round(setupProgress)}% completed</Text>
                  <Text color="subdued">{`${Math.round(
                    setupProgress / 33.33
                  )} / 3 completed`}</Text>
                </InlineStack>
                <ProgressBar progress={setupProgress} size="small" />
              </BlockStack>

              <List>
                <List.Item>
                  {stats?.products > 0 ? "✓" : "○"} Add products to your store
                </List.Item>
                <List.Item>
                  {stats?.option_sets > 0 ? "✓" : "○"} Create your first option
                  set
                </List.Item>
                <List.Item>
                  {stats?.orders > 0 ? "✓" : "○"} Get your first order
                </List.Item>
              </List>
            </BlockStack>
          </Card>
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
            <BlockStack gap="400">
              <Text variant="headingMd">Current plan</Text>
              <Text>
                You are currently on a{" "}
                <b>{storeInfo?.plan_display_name || "development"}</b> plan
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Quick Actions */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd">Quick actions</Text>
              <InlineStack gap="200">
                <Button
                  variant="primary"
                  onClick={() => handleAction("/option-sets/new")}
                >
                  Create option set
                </Button>
                <Button onClick={() => handleAction("/option-sets")}>
                  View all option sets
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>

        {/* Help Section */}
        <Layout.Section secondary>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd">Need help setting up your app?</Text>
              <Text color="subdued">
                Our support team is ready to help with our in-app live chat.
              </Text>
              <Button fullWidth>Chat with us</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
