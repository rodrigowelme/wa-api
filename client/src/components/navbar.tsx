import { RiMenu2Fill } from 'react-icons/ri';
export function Navbar() {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-base-300">
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <RiMenu2Fill className="scale-150" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
