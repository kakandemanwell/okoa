import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import '@mantine/charts/styles.css';
import { MantineProvider } from "@mantine/core";
import { Router } from './Router';
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './components/Layout';
export default function App() {
  const queryClient = new QueryClient()
  return <MantineProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Router />
      </AppLayout>
    </QueryClientProvider>
  </MantineProvider>;
}
