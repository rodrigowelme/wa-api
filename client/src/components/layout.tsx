import { useState } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

interface layout {
  children: React.ReactNode;
}
export default function Layout({ children }: layout) {
  const [menuNavbar, setMenuNavbar] = useState(false);
  return (
    <main data-theme={'dark'} className="flex flex-col h-screen">
      <Navbar setMenuNavbar={setMenuNavbar} menuNavbar={menuNavbar} />
      <div className="flex overflow-auto h-full">
        <Sidebar setMenuNavbar={setMenuNavbar} menuNavbar={menuNavbar} />
        {children}
      </div>
    </main>
  );
}
