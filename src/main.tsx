import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { LicenseInfo } from "@mui/x-license";
import { QueryClient, QueryClientProvider } from "react-query";
import {CONFIG} from "./consts/config.ts";


LicenseInfo.setLicenseKey(CONFIG.MUI_LICENSE_KEY);
const queryClient = new QueryClient();


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
  </StrictMode>,
)
