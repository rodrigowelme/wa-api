import { SiSessionize } from 'react-icons/si';

export function Sidebar() {
  return (
    <div className="overflow-auto bg-base-300 hidden md:block">
      <ul className="menu text-base-content">
        <li>
          <a>
            <SiSessionize size={20} />
            <p className="md:block">Gerenciar Sessões</p>
          </a>
        </li>
      </ul>
    </div>
  );
}
