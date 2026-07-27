import LoginBanner from "../../components/forms/LoginBanner";
import LoginForm from "../../components/forms/LoginForm";

function Login() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <LoginBanner />
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;