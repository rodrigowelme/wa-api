import { RiMenu2Fill } from 'react-icons/ri';
export function Navbar() {
  return (
    <main className="bg-[#1F2937] p-2">
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          <RiMenu2Fill className="scale-150" />
        </label>
      </div>
    </main>
  );
}
