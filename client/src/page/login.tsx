import ChangeTheme from "../components/changeTheme";
import LOGO from "../images/crazy.png";
export function PageLogin() {
  return (
    <main className="grid place-items-center h-screen">
      <div className="absolute top-0 right-0 m-2">
        <ChangeTheme />
      </div>
      <form
        className="flex flex-col gap-2 bg-base-300 p-3 rounded-md max-w-md w-full"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <img src={LOGO} />
        <label className="label">
          <span className="label-text text-md">E-mail</span>
        </label>
        <input type="text" placeholder="E-mail" className="input input-bordered w-full" />

        <label className="label">
          <span className="label-text text-md">Senha</span>
        </label>
        <input type="text" placeholder="Senha" className="input input-bordered w-full" />

        <button className="btn bg-base-100 mx-auto btn-ghost" type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
}
