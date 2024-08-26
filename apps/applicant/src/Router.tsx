import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ApplyPage } from './pages/Apply.page';
import { ResponsePage } from './pages/Response.page';

const router = createHashRouter([
  {
    path: '/',
    element: <ApplyPage />,
  },
  {
    path: 'response',
    element: <ResponsePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
