import { Link, useRouteError } from "react-router";

function Error() {
  const error = useRouteError();
  console.error("Error occurred:", error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-red-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-20 h-20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-2 text-[#1e1e1e]">
        Oops! Something went wrong.
      </h1>
      <p className="mb-6 text-gray-600 text-center">
        The page you are looking for does not exist or an unexpected error has
        occurred.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default Error;
