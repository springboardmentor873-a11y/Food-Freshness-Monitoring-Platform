import { Link } from "react-router-dom";

import InputField from "../../components/forms/InputField";
import PasswordField from "../../components/forms/PasswordField";
import PrimaryButton from "../../components/forms/PrimaryButton";

function Register() {
  return (
    <div>
      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-800">
        Create Account
      </h2>

      <p className="mt-2 text-gray-500">
        Create your account to get started
      </p>

      {/* Form */}
      <form className="mt-8 space-y-5">

        <InputField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          name="fullName"
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          name="email"
        />

        <PasswordField
          label="Password"
          placeholder="Create a password"
          name="password"
        />

        <PasswordField
          label="Confirm Password"
          placeholder="Confirm your password"
          name="confirmPassword"
        />

        <PrimaryButton type="submit">
          Create Account
        </PrimaryButton>

      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
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

export default Register;