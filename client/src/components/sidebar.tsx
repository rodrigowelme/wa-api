import { SiSessionize } from 'react-icons/si';

interface Sidebar {
  setMenuNavbar: React.Dispatch<React.SetStateAction<boolean>>;
  menuNavbar: boolean;
}

export function Sidebar({ menuNavbar }: Sidebar) {
  return (
    <div className="overflow-auto bg-base-300 hidden md:block">
      <ul className="menu text-base-content">
        <li>
          <a>
            <SiSessionize size={20} />
            <p className={`duration-500 ${menuNavbar ? 'ml-0' : '-ml-52'}`}>Gerenciar Sessões</p>
          </a>
        </li>
      </ul>
    </div>
  );
}
