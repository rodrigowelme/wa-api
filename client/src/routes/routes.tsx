import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PageLogin } from '../page/login';
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLogin />} path="/login" />
      </Routes>
    </BrowserRouter>
  );
}
