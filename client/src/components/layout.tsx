import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

interface layout {
  children: React.ReactNode;
}
export default function Layout({ children }: layout) {
  return (
    <main data-theme="aqua" className="flex flex-col h-screen">
      <Navbar />
      <div className="flex overflow-auto h-full">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
