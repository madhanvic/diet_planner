import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../lib/axios";
import { useEffect, useState } from "react";
import Dropdown, { type DropdownOption } from "../../components/ui/Dropdown";
import useToast from "../../hooks/useToast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getSession, setSession } from "../auth/authSlice";
import { useSWRConfig } from "swr";

interface MetricsFormInterface {
  height: string;
  weight: string;
  preference: DropdownOption | null;
  goal: DropdownOption | null;
  planType: DropdownOption | null;
}
interface GenratedResponse {
  data: {
    [key: string]: string;
  };
  message: string;
}
const validationSchema = Yup.object({
  weight: Yup.number().required("Please enter your name"),
  height: Yup.number().required("Please enter your email"),
  goal: Yup.object().required("Please select your goal"),
  preference: Yup.object().nullable().required("Please select your preference"),
  planType: Yup.object().nullable().required("Please select your plan type"),
});

const initialValues: MetricsFormInterface = {
  height: "",
  weight: "",
  preference: null,
  planType: null,
  goal: null,
};

const preferences = [
  {
    id: "1",
    label: "vegetarian",
  },
  {
    id: "2",
    label: "non-vegetarian",
  },
  {
    id: "3",
    label: "vegan",
  },
];

const goals = [
  {
    id: "1",
    label: "weight loss",
  },
  {
    id: "2",
    label: "weight gain",
  },
  {
    id: "3",
    label: "maintaince",
  },
];

const planType = [
  {
    id: "1",
    label: "weekly",
  },
  {
    id: "2",
    label: "monthly",
  },
];

function MetricsForm() {
  const [error, setError] = useState<string | null>(null);
  const [bmi, setBmi] = useState<string>("");
  const session = useAppSelector(getSession);
  const dispatch = useAppDispatch();
  const { mutate } = useSWRConfig();

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
      onGenrate(values);
    },
  });

  const { createToast } = useToast();

  useEffect(() => {
    if (values.weight !== null && values.height !== null) {
      const weight = parseFloat(values.weight);
      const height = parseFloat(values.height);
      if (isNaN(weight) || isNaN(height)) {
        return;
      }
      const bmi = weight / (height * height);
      console.log(bmi);

      setBmi(bmi.toFixed(2));
    }
  }, [values.height, values.weight]);

  const onSelectHandler = ({
    name,
    option,
  }: {
    name: string;
    option: DropdownOption | null;
  }) => {
    setFormikState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: option,
      },
      errors: {
        [name]: null,
      },
    }));
  };

  const onGenrate = async (values: MetricsFormInterface) => {
    try {
      setSubmitting(true);
      const body = {
        ...values,
        preference: values.preference!.label,
        planType: values.planType!.label,
        goal: values.goal!.label,
        bmi: bmi,
      };

      const response = (await api.post<GenratedResponse>(
        "/user/plan/genrate",
        body
      )) as unknown as GenratedResponse;
      createToast({
        type: "success",
        message: response.message,
      });

      mutate("/user/plan");

      const updatedSession = {
        ...session,
        activePlan: response.data.activePlan,
        bmi: response.data.bmi,
        height: response.data.height,
        weight: response.data.weight,
        goal: response.data.goal,
      };

      localStorage.setItem("session", JSON.stringify(updatedSession));

      dispatch(setSession(updatedSession));

      setError(null);
    } catch (error) {
      setError(
        (error as { message: string }).message ||
          "Genration failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-[480px] p-4">
        <h2 className="text-4xl font-bold mb-6 text-center">Metrics Form</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Weight (kg)"
            type="number"
            name="weight"
            value={values.weight}
            onChange={handleChange}
            error={errors.weight}
            controlled={true}
          />
          <Input
            label="Height (m)"
            type="number"
            name="height"
            value={values.height}
            onChange={handleChange}
            error={errors.height}
            controlled={true}
          />
          <Input
            label="BMI"
            type="text"
            name="height"
            value={bmi}
            controlled={true}
            readOnly={true}
          />
          <div>
            <Dropdown
              targetLabel="label"
              onSelectOption={onSelectHandler}
              value={values.preference !== null ? values.preference.label : ""}
              id="preferenceDropdown"
              name="preference"
              selectedOption={values.preference}
              label="Preference"
              error={errors.preference}
              classNames={{
                dropdownWrapper: "!z-[999]",
              }}
            >
              <Dropdown.options
                options={preferences}
                targetLabel="label"
                name="preference"
                onSelectOption={onSelectHandler}
              />
            </Dropdown>
          </div>

          <div>
            <Dropdown
              targetLabel="label"
              onSelectOption={onSelectHandler}
              value={values.goal !== null ? values.goal.label : ""}
              id="goalDropdown"
              name="goal"
              selectedOption={values.goal}
              label="Goal"
              error={errors.goal}
              classNames={{
                dropdownWrapper: "!z-[999]",
              }}
            >
              <Dropdown.options
                options={goals}
                targetLabel="label"
                name="goal"
                onSelectOption={onSelectHandler}
              />
            </Dropdown>
          </div>

          <div>
            <Dropdown
              targetLabel="label"
              onSelectOption={onSelectHandler}
              value={values.planType !== null ? values.planType.label : ""}
              id="planDropdown"
              name="planType"
              selectedOption={values.planType}
              label="Plan Type"
              error={errors.planType}
              classNames={{
                dropdownWrapper: "!z-[999]",
              }}
            >
              <Dropdown.options
                options={planType}
                targetLabel="label"
                name="planType"
                onSelectOption={onSelectHandler}
              />
            </Dropdown>
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            Genrate Plan
          </Button>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-center text-sm">{error}</div>
        )}
      </div>
    </>
  );
}

export default MetricsForm;
