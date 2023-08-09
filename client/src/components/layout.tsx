import { SiSessionize } from 'react-icons/si';
import { AiFillApi } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './navbar';
export default function Layout() {
  const route = useNavigate();
  return (
    <>
      <Navbar />
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu w-80 h-full bg-base-200 text-base-content">
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button my-2" onClick={() => route('/dashboard')}>
              <AiFillApi className="scale-150" />
              WA-Api
            </label>
            <li>
              <a onClick={() => route('/sessions')}>
                <SiSessionize className="scale-150" /> Sessões
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
