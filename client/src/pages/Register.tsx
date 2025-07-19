import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../lib/axios";
import { useState } from "react";
import OverlayLoader from "../components/ui/OverlayLoader";
import { Link, useNavigate } from "react-router";
import type { DropdownOption } from "../components/ui/Dropdown";
import type { LoginInteface } from "./Login";
import Dropdown from "../components/ui/Dropdown";
import useToast from "../hooks/useToast";

interface RegisterInterface extends LoginInteface {
  name: string;
  age: string;
  gender: DropdownOption | null;
}
interface RegisterResponse {
  message: string;
}
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Minimum 2 characters")
    .required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Please enter your password"),
  age: Yup.number()
    .min(1, "Age must be a positive number")
    .required("Please enter your age"),
  gender: Yup.object().required("Please select your gender"),
});

const initialValues: RegisterInterface = {
  name: "",
  email: "",
  age: "",
  gender: null,
  password: "",
};

// const preferences = [
//   {
//     id: "1",
//     label: "vegetarian",
//   },
//   {
//     id: "2",
//     label: "non-vegetarian",
//   },
//   {
//     id: "3",
//     label: "vegan",
//   },
// ];

// const goals = [
//   {
//     id: "1",
//     label: "weight loss",
//   },
//   {
//     id: "2",
//     label: "weight gain",
//   },
//   {
//     id: "3",
//     label: "maintaince",
//   },
// ];

const genders = [
  {
    id: "1",
    label: "male",
  },
  {
    id: "2",
    label: "female",
  },
  {
    id: "3",
    label: "others",
  },
];

function Register() {
  const [error, setError] = useState<string | null>(null);
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    setFormikState,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      onRegister(values);
    },
  });
  const { createToast } = useToast();
  const navigate = useNavigate();

  const onSelectHandler = ({
    name,
    option,
  }: {
    name: string;
    option: DropdownOption | null;
  }) => {
    console.log(option);

    setFormikState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: option,
      },
    }));
  };

  const onRegister = async (values: RegisterInterface) => {
    try {
      setSubmitting(true);
      const body = { ...values, gender: values.gender!.label };
      const response = (await api.post<RegisterResponse>(
        "/register",
        body
      )) as unknown as RegisterResponse;
      createToast({
        type: "success",
        message: response.message,
      });
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(
        (error as { message: string }).message ||
          "Registration failed. Please check your credentials."
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
            <h2 className="text-4xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Name"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                controlled={true}
              />
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
                label="Age"
                type="text"
                name="age"
                value={values.age}
                onChange={handleChange}
                error={errors.age}
                controlled={true}
              />
              <div>
                <Dropdown
                  targetLabel="label"
                  onSelectOption={onSelectHandler}
                  value={values.gender !== null ? values.gender.label : ""}
                  id="genderDropdown"
                  name="gender"
                  selectedOption={values.gender}
                  label="Gender"
                  error={errors.gender}
                >
                  <Dropdown.options
                    options={genders}
                    targetLabel="label"
                    name="gender"
                    onSelectOption={onSelectHandler}
                  />
                </Dropdown>
              </div>

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
                Register
              </Button>
            </form>
            {error && (
              <div className="mt-4 text-red-500 text-center text-sm">
                {error}
              </div>
            )}
            <div className="text-center mt-4">
              <Link to="/login" className="text-[#1e1e1e]">
                Already have an account?{" "}
                <strong className="hover:underline text-primary italic">
                  Login here
                </strong>
              </Link>
            </div>
          </div>
        </div>
      </main>
      {isSubmitting && <OverlayLoader />}
    </>
  );
}

export default Register;
