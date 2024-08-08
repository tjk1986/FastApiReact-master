// Store
import { useGetData } from "../store/store";

function Alert() {
  const error = useGetData((state) => state.error);
  const errorData = useGetData((state) => state.errorData);
  const removeError = useGetData((state) => state.removeError);

  if (error) {
    setTimeout(() => {
      removeError();
    }, 5000);
  }

  if (!error) return null;

  return (
    <div
      role="alert"
      className="absolute rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 top-2 right-2 z-50"
    >
      <div className="flex items-start gap-4">
        <span className="text-red-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>

        <div className="flex-1">
          <strong className="block font-medium text-gray-900 dark:text-white">
            Error
          </strong>

          <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
            {errorData}
          </p>
        </div>

        <button
          className="text-gray-500 transition hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500"
          onClick={removeError}
        >
          <span className="sr-only">Dismiss popup</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Alert;
