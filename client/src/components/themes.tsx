import { useDispatch } from 'react-redux';
import { changeTheme, themes } from '../store/configSlice';

export function Themes() {
  const dispatch = useDispatch();
  return (
    <main>
      <select className="select select-bordered select-sm w-full max-w-xs" onChange={(e) => dispatch(changeTheme({ theme: e.target.value }))}>
        {themes.map((theme) => (
          <option key={theme}>{theme}</option>
        ))}
      </select>
    </main>
  );
}
