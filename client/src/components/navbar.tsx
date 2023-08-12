import { RiMenu2Fill } from 'react-icons/ri';
import { FaUserLarge } from 'react-icons/fa6';

interface Navbar {
  setMenuNavbar: React.Dispatch<React.SetStateAction<boolean>>;
  menuNavbar: boolean;
}

export function Navbar({ setMenuNavbar, menuNavbar }: Navbar) {
  return (
    <div className="navbar bg-base-300">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost" onClick={() => setMenuNavbar(!menuNavbar)}>
          <RiMenu2Fill size={30} />
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">wa-api</a>
      </div>
      <div className="flex-none">
        <select name="" id="">
          <option value="">Dark</option>
        </select>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <FaUserLarge size={40} />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-300 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
