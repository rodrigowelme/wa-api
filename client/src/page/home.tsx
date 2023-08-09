import { useNavigate } from 'react-router-dom';

export function PageHome() {
  const route = useNavigate();
  return (
    <>
      <div className="grid h-screen place-content-center">
        <button className="btn btn-primary" onClick={() => route('/dashboard')}>
          Login
        </button>
      </div>
    </>
  );
}
