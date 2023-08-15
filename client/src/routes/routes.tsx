import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageLogin } from "../page/login";
import { PageHome } from "../page/home";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLogin />} path="/login" />
        <Route element={<PageHome />} path="/home" />
      </Routes>
    </BrowserRouter>
  );
}
