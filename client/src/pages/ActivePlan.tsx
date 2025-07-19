import useSWR from "swr";
import { getPlan } from "../lib/api";
import Loader from "./Loader";
import { useAppSelector } from "../store/hooks";
import { getAuthSlice } from "../features/auth/authSlice";
import { formatDistanceToNow } from "date-fns";
function ActivePlan() {
  const { session, isAuthorizig } = useAppSelector(getAuthSlice);
  const { data: response, isLoading } = useSWR("/user/plan", getPlan);
  console.log(session);
  return isLoading || isAuthorizig ? (
    <Loader />
  ) : response?.data === null ? (
    <p className="text-sm text-[#1e1e1e]">No Active Plans Found</p>
  ) : (
    <div className="flex items-center justify-center h-full">
      <div className="[&_p]:text-[#1e1e1e] [&_p]:text-lg border border-primary p-6 rounded-md space-y-4">
        <p>
          <strong>Calories per data</strong> : {response?.data.caloriesPerDay}
        </p>
        <p>
          <strong>BMI</strong> : {session?.bmi}
        </p>
        <p>
          <strong>Goal</strong> : {session!.goal}
        </p>
        <p>
          <strong>Plan type</strong> : {response?.data.planType}
        </p>
        <p>
          It's been{" "}
          <strong>
            {formatDistanceToNow(new Date(response?.data.createdAt))}
          </strong>{" "}
          ago !
        </p>
      </div>
    </div>
  );
}

export default ActivePlan;
