import { useState } from "react";
import { Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

export function ProductsCard() {
  const shopify = useAppBridge();
  const { t } = useTranslation();
  const [isPopulating, setIsPopulating] = useState(false);
  const productsCount = 5;

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
  } = useQuery({
    queryKey: ["productCount"],
    queryFn: async () => {
      const response = await fetch("/api/products/count");
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  const setPopulating = (flag) => {
    shopify.loading(flag);
    setIsPopulating(flag);
  };

  const handlePopulate = async () => {
    setPopulating(true);
    const response = await fetch("/api/products", { method: "POST" });

    if (response.ok) {
      await refetchProductCount();

      shopify.toast.show(
        t("ProductsCard.productsCreatedToast", { count: productsCount })
      );
    } else {
      shopify.toast.show(t("ProductsCard.errorCreatingProductsToast"), {
        isError: true,
      });
    }

    setPopulating(false);
  };

  return (
    <Card title={t("ProductsCard.title")}>
      <BlockStack gap="200">
        <p>{t("ProductsCard.description")}</p>
        <Text as="h4" variant="headingMd">
          {t("ProductsCard.totalProductsHeading")}
        </Text>
        <Text variant="bodyMd" as="p" fontWeight="semibold">
          {isLoadingCount ? "-" : data?.count}
        </Text>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handlePopulate}
            loading={isPopulating}
            variant="primary"
          >
            {t("ProductsCard.populateProductsButton", {
              count: productsCount,
            })}
          </Button>
        </div>
      </BlockStack>
    </Card>
  );
}
