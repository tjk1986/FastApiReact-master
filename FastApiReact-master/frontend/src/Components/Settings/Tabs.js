// Store
import { useGetData } from "../../store/store";

function Tabs() {
  const tab = useGetData((state) => state.tab);
  const setTab = useGetData((state) => state.setTab);
  const columns = useGetData((state) => state.settings.columns);
  const outputType = useGetData((state) => state.settings.ouput_type);

  const trainingSet = () => {
    let disabled = true;
    columns.map((column) => {
      if (column.training) return (disabled = false);
    });
    return disabled;
  };

  const createClassName = (name) => {
    const base = "inline-flex shrink-0 items-center gap-2 px-1 pb-2 text-lg";

    if (name !== tab) return base;

    const newClassName = `${base} border-b-2 dark:border-blue-500 dark:text-white`;
    return newClassName;
  };

  return (
    <div className="flex w-full items-center justify-center pt-2">
      <div className="hidden sm:block">
        <div className="">
          <nav className="-mb-px flex gap-20" aria-label="Tabs">
            <button
              id="columns"
              onClick={() => setTab("columns")}
              className={createClassName("columns")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
                />
              </svg>
              Columns
            </button>

            <button
              id="target"
              onClick={() => setTab("target")}
              className={createClassName("target")}
              disabled={trainingSet()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
              Target
            </button>

            <button
              id="model"
              onClick={() => setTab("model")}
              className={createClassName("model")}
              disabled={trainingSet() || outputType === ""}
              aria-current="page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                />
              </svg>
              Model
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Tabs;
