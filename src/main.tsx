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

LicenseInfo.setLicenseKey(
  "c484f5b7ccc06428b20f971c4eff136Tz03MTQyMixFPTE3MjE5MjA1MjMwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI"
);
const queryClient = new QueryClient();

const tanstackQueryClient = new TanStackQueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1500,
    },
  },
});

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
