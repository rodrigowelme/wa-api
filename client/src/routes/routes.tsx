import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PageLogin } from '../page/login';
import { Layout } from "../components/layout";
import { Dashboard } from "../page/dashboard";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLogin />} path="/login" />
        <Route
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
          path="/dashboard"
        />
      </Routes>
    </BrowserRouter>
  );
}
