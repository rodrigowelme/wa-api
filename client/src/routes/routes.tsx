import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PageHome } from '../page/home';
import { PageDashboard } from '../page/dashboard';
import { PageSessions } from '../page/sessions';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageHome />} path="/" />
        <Route element={<PageDashboard />} path="/dashboard" />
        <Route element={<PageSessions />} path="/sessions" />
      </Routes>
    </BrowserRouter>
  );
}
