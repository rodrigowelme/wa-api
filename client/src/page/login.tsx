import { useState } from "react";
import { Themes } from "../components/themes";

export function PageLogin() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="grid h-screen place-content-center">
      <form className="card bg-base-300 p-4 w-80">
        <h1 className="my-2 text-center">Entre com usuário e senha.</h1>
        <div className="my-2">
          <input type="text" placeholder="Usuário" className="input input-bordered input-sm w-full max-w-xs" />
        </div>
        <div className="my-2">
          <input type="password" placeholder="Senha" className="input input-bordered input-sm w-full max-w-xs" />
        </div>
        <Themes />
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Remember me</span>
            <input type="checkbox" className="toggle" checked={checked} onClick={() => setChecked(!checked)} />
          </label>
        </div>

        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}
