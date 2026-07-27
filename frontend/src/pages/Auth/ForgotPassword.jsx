import { Link } from "react-router-dom";

import InputField from "../../components/forms/InputField";
import PrimaryButton from "../../components/forms/PrimaryButton";

function ForgotPassword() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Forgot Password
      </h2>

      <p className="mt-2 text-gray-500">
        Enter your email to receive a password reset link.
      </p>

      <form className="mt-8 space-y-5">
        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          name="email"
        />

        <PrimaryButton type="submit">
          Send Reset Link
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-green-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;