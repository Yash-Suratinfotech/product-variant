import { BrowserRouter } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { QueryProvider, PolarisProvider, CounterProvider } from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });

  return (
    <PolarisProvider>
      <BrowserRouter>
        <QueryProvider>
          <CounterProvider>
            <NavMenu>
              <a href="/" rel="home" />
              <a href="/option-sets">Option Sets</a>
            </NavMenu>
            <Routes pages={pages} />
          </CounterProvider>
        </QueryProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
