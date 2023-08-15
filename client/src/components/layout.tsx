import { useState } from "react";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

interface Layout {
  children: React.ReactNode;
}
export default function Layout({ children }: Layout) {
  const [menuNavbar, setMenuNavbar] = useState(false);
  return (
    <main className="flex flex-col h-screen">
      <Navbar setMenuNavbar={setMenuNavbar} menuNavbar={menuNavbar} />
      <div className="flex overflow-auto h-full">
        <Sidebar setMenuNavbar={setMenuNavbar} menuNavbar={menuNavbar} />
        {children}
      </div>
    </main>
  );
}
