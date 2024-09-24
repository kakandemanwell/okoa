import { createHashRouter, RouterProvider } from 'react-router-dom';
import { DashboardPage } from './pages/Dashboard.page';
import { ExpenseReports } from './pages/ExpenseReports.page';
import { ExpenseReport } from './pages/ExpenseReport.page';
import { AdvanceReports } from './pages/AdvanceReports.page';
import { AdvanceReport } from './pages/AdvanceReport.page';

const router = createHashRouter([
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: 'expense-reports',
    element: <ExpenseReports />,
  },
  {
    path: 'expense-reports/:id',
    element: <ExpenseReport />,
  },
  {
    path: 'advance-reports',
    element: <AdvanceReports />,
  },
  {
    path: 'advance-reports/:id',
    element: <AdvanceReport />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
