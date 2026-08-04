import AuthHeroBanner from "../../components/forms/AuthHeroBanner";
import RegisterForm from "../../components/forms/RegisterForm";

function Register() {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <AuthHeroBanner
          title="Join Freshness AI"
          subtitle="Harnessing advanced spectral imaging and deep learning to ensure peak freshness across your entire supply chain."
        />
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
