import { SiSessionize } from 'react-icons/si';

interface Sidebar {
  setMenuNavbar: React.Dispatch<React.SetStateAction<boolean>>;
  menuNavbar: boolean;
}

export function Sidebar({ setMenuNavbar, menuNavbar }: Sidebar) {
  return (
    <div className={`sm:block ${menuNavbar? 'block' : 'block'} overflow-auto bg-base-300`} onMouseEnter={()=> setMenuNavbar(!menuNavbar)} onMouseLeave={()=> setMenuNavbar(!menuNavbar)}>
      <ul className={`menu text-base-content`} >
        <li>
          <a>
            <SiSessionize size={20} />
            <p className={`overflow-hidden transition-[width] duration-500 ${menuNavbar ? 'w-40' : 'w-0'} whitespace-nowrap`}>Gerenciar Sessões</p>
          </a>
        </li>
      </ul>
    </div>
  );
}
