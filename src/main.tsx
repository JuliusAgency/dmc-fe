import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import "./index.css";
import App from "./App.tsx";
import { LicenseInfo } from "@mui/x-license";
import { QueryClient, QueryClientProvider } from "react-query";
import { CONFIG } from "./consts/config.ts";

LicenseInfo.setLicenseKey(CONFIG.MUI_LICENSE_KEY);
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Router>
    </Provider>
  </StrictMode>
);
