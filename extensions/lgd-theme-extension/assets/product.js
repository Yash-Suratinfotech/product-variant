(async function () {
  var container = document.getElementById("custom-product-options-block");
  var productId = container.dataset.productId;

  // Replace this URL with your public API endpoint test static id
  const response = await fetch(
    `/apps/proxy/option-set/19?shop=${Shopify.shop}`
  );
  const optionSets = await response.json();
  console.log("✌️optionSets --->", optionSets);

  // Example render logic
  if (optionSets && optionSets?.fields?.length) {
    container.innerHTML = optionSets?.fields
      .map(
        (f) => `
        <div>
          <strong>${f.config?.name}</strong>: ${f.config?.label}
          <br />
          <input type="${f?.type}" name="${f.config?.name}" />
          <br />
        </div>
      `
      )
      .join("");
  } else {
    container.innerHTML = "<em>No custom options found.</em>";
  }
})();
