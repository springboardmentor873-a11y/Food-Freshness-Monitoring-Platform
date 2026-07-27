import { Link } from "react-router-dom";

import PasswordField from "../../components/forms/PasswordField";
import PrimaryButton from "../../components/forms/PrimaryButton";

function ResetPassword() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">
        Reset Password
      </h2>

      <p className="mt-2 text-gray-500">
        Create a new password for your account.
      </p>

      <form className="mt-8 space-y-5">
        <PasswordField
          label="New Password"
          placeholder="Enter new password"
          name="password"
        />

        <PasswordField
          label="Confirm Password"
          placeholder="Confirm new password"
          name="confirmPassword"
        />

        <PrimaryButton type="submit">
          Reset Password
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Back to{" "}
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

export default ResetPassword;