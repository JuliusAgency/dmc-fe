import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import App from "./App.tsx";
import { LicenseInfo } from "@mui/x-license-pro";
import { QueryClient, QueryClientProvider } from "react-query";
import { CONFIG } from "./consts/config.ts";
import {
  QueryClient as TanStackQueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const tanstackQueryClient = new TanStackQueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1500,
    },
  },
});

LicenseInfo.setLicenseKey(CONFIG.MUI_LICENSE_KEY);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <QueryClientProvider client={queryClient}>
          <TanStackQueryClientProvider client={tanstackQueryClient}>
            <App />
          </TanStackQueryClientProvider>
        </QueryClientProvider>
      </Router>
    </Provider>
  </StrictMode>
);
