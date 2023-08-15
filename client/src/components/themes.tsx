import { useDispatch } from "react-redux";
import { Config, changeTheme, themes } from "../store/configAppSlice";
export function Themes() {
  const dispatch = useDispatch();
  return (
    <main>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Selecione Tema</span>
          <select
            className="select select-bordered select-sm max-w-xs bg-base-300"
            onChange={(e) => dispatch(changeTheme({ theme: e.target.value } as Config))}
          >
            {themes.map((theme) => (
              <option key={theme}>{theme}</option>
            ))}
          </select>
        </label>
      </div>
    </main>
  );
}
