import { SiSessionize } from 'react-icons/si';
import {Link} from 'react-router-dom'

interface Sidebar {
  setMenuNavbar: React.Dispatch<React.SetStateAction<boolean>>;
  menuNavbar: boolean;
}

export function Sidebar({ setMenuNavbar, menuNavbar }: Sidebar) {
  return (
    <div className={`overflow-auto bg-base-300`}>
      <ul className={`menu text-base-content`}>
        <li>
          <Link to={'/sessions'}>
            <SiSessionize size={20} />
            <p className={`overflow-hidden transition-[width] duration-500 ${menuNavbar ? 'w-32' : 'w-0'} whitespace-nowrap`}>Gerenciar Sessões</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
