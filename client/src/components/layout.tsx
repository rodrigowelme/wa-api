import { useState } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { useSelector } from 'react-redux';
import { config } from '../store/configSlice';

interface layout {
  children: React.ReactNode;
}
export default function Layout({ children }: layout) {
  const [menuNavbar, setMenuNavbar] = useState(false);
  const { theme } = useSelector(config);
  return (
    <main data-theme={theme} className="flex flex-col h-screen">
      <Navbar setMenuNavbar={setMenuNavbar} menuNavbar={menuNavbar} />
      <div className="flex overflow-auto h-full">
        <Sidebar setMenuNavbar={setMenuNavbar} menuNavbar={menuNavbar} />
        {children}
      </div>
    </main>
  );
}
