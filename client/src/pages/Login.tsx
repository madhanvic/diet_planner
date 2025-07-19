import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../lib/axios";
import { useAppDispatch } from "../store/hooks";
import { login, type Session } from "../features/auth/authSlice";
import { useState } from "react";
import OverlayLoader from "../components/ui/OverlayLoader";
import { Link } from "react-router";

export interface LoginInteface {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string;
  data: Session;
}
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Please enter your password"),
});

const initialValues: LoginInteface = {
  email: "",
  password: "",
};
const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onLogin(values);
    },
  });
  const dispatch = useAppDispatch();
  const onLogin = async (values: LoginInteface) => {
    try {
      setSubmitting(true);
      const response = (await api.post<LoginResponse>(
        "/login",
        values
      )) as unknown as LoginResponse;
      dispatch(login(response));
      setError(null);
    } catch (error) {
      setError(
        (error as { message: string }).message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="h-screen grid grid-cols-2 bg-primary">
        <div className="col-[2/3] bg-white shadow-md flex items-center justify-center">
          <div className="w-1/2">
            <h2 className="text-4xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                controlled={true}
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                controlled={true}
              />
              <Button disabled={isSubmitting} type="submit" className="w-full">
                Login
              </Button>
            </form>
            {error && (
              <div className="mt-4 text-red-500 text-center text-sm">
                {error}
              </div>
            )}
            <div className="text-center mt-4">
              <Link to="/register" className="text-[#1e1e1e]">
                Don't have an account?{" "}
                <strong className="hover:underline text-primary italic">
                  Register here
                </strong>
              </Link>
            </div>
          </div>
        </div>
      </main>
      {isSubmitting && <OverlayLoader />}
    </>
  );
};

export default Login;
