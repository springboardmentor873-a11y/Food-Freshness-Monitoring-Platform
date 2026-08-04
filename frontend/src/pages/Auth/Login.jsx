import AuthHeroBanner from "../../components/forms/AuthHeroBanner";
import LoginForm from "../../components/forms/LoginForm";

function Login() {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <AuthHeroBanner
          title="Freshness AI Platform"
          subtitle="Enterprise-grade quality control, computer vision freshness predictions, and real-time inventory oversight."
        />
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;