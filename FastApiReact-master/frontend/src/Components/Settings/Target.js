// Imports
import { useEffect, useState } from "react";

// Store
import { useGetData } from "../../store/store";

function Target() {
  const file = useGetData((state) => state.fileSelected);
  const settings = useGetData((state) => state.settings);
  const getSettings = useGetData((state) => state.getSettings);
  const setSettings = useGetData((state) => state.setSettings);
  const saveTarget = useGetData((state) => state.saveTarget);
  const [value, setValue] = useState();

  useEffect(() => {
    getSettings(file);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const values = [...settings["labels"]];
      values.push(value);
      setSettings({ type: "labels", value: values });
      setValue("");
    }
  };

  const handleAdd = (e) => {
    const values = [...settings["labels"]];
    values.push(value);
    setSettings({ type: "labels", value: values });
    setValue("");
  };

  const handleRemove = (e) => {
    const values = [...settings["labels"]];
    values.splice(e.currentTarget.id, 1);
    setSettings({ type: "labels", value: values });
  };

  const handleClick = (e, type) => {
    if (type === "existing") {
      setSettings({ type: type, value: !settings.existing });
      e.target.blur();
      return;
    }
    setSettings({ type: type, value: e.target.value });
    e.target.blur();
  };

  return (
    <div className="flex flex-col items-center w-h h-full py-5 overflow-y-auto">
      <div className="flex flex-col items-center w-[80%] h-full py-5">
        <div className="container container-sm max-w-[400px]">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
            Output type
          </label>
          <fieldset className="">
            <legend className="sr-only">Linear</legend>

            <div className="pb-2">
              <label
                htmlFor="Linear"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-800 p-4 text-sm font-medium shadow-sm hover:border-gray-900 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:bg-gray-900 dark:hover:border-gray-700"
              >
                <p className="text-gray-700 dark:text-gray-200">Linear</p>

                <p className="text-gray-900 dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                </p>

                <input
                  type="radio"
                  name="DeliveryOption"
                  value="Linear"
                  id="Linear"
                  className="sr-only"
                  disabled={settings["status"] === 1}
                  checked={settings["ouput_type"] === "Linear"}
                  onChange={(e) =>
                    setSettings({ type: "ouput_type", value: "Linear" })
                  }
                />
              </label>
            </div>

            <div className="pb-5">
              <label
                htmlFor="Categorical"
                className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-800 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:bg-gray-900 dark:hover:border-gray-700"
              >
                <p className="text-gray-700 dark:text-gray-200">Categorical</p>

                <p className="text-gray-900 dark:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                    />
                  </svg>
                </p>

                <input
                  type="radio"
                  name="DeliveryOption"
                  value="Categorical"
                  id="Categorical"
                  className="sr-only"
                  disabled={settings["status"] === 1}
                  checked={settings["ouput_type"] === "Categorical"}
                  onChange={(e) =>
                    setSettings({ type: "ouput_type", value: "Categorical" })
                  }
                />
              </label>
            </div>
          </fieldset>

          <fieldset
            className={
              settings["ouput_type"] === "Categorical" ? null : "hidden"
            }
          >
            <legend className="sr-only">Checkboxes</legend>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <label
                htmlFor="existing"
                className="flex cursor-pointer items-start gap-4 py-4"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900"
                    id="existing"
                    value={settings.existing}
                    checked={settings.existing}
                    onChange={(event) => handleClick(event, "existing")}
                  />
                </div>

                <div>
                  <strong className="font-medium text-gray-900 dark:text-white">
                    Existing column
                  </strong>
                </div>
              </label>
            </div>
          </fieldset>

          <div
            className={`relative pb-5 ${
              settings["ouput_type"] === "Categorical" && !settings["existing"]
                ? null
                : "hidden"
            }`}
          >
            <label
              htmlFor="target"
              className="block text-xs font-medium text-gray-700 dark:text-gray-200"
            >
              Column name
            </label>

            <input
              type="text"
              id="target"
              placeholder="Column/target name..."
              className="w-full rounded-md border-gray-200 pe-10 shadow-sm sm:text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              value={settings["target"]}
              disabled={settings["status"] === 1}
              onChange={(e) =>
                setSettings({ type: "target", value: e.target.value })
              }
            />
          </div>

          <div
            className={`${
              settings["ouput_type"] === "Categorical" && !settings["existing"]
                ? null
                : "hidden"
            }`}
          >
            <div className="relative pb-5">
              <label
                htmlFor="Labels"
                className="block text-xs font-medium text-gray-700 dark:text-gray-200"
              >
                Target labels
              </label>

              <input
                type="text"
                id="Labels"
                placeholder="Write label and press Enter"
                className="w-full rounded-md border-gray-200 pe-10 shadow-sm sm:text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e)}
              />
              <span className="absolute inset-y-0 end-0 grid w-10 h-full place-content-center text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => handleAdd()}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
            </div>
            <div>
              {settings["labels"].map((label, idx) => {
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center rounded-full mr-1 mb-1 px-2.5 py-0.5 text-white font-medium"
                  >
                    <p className="whitespace-nowrap text-sm">{label}</p>

                    <button
                      className="-me-1 ms-1.5 inline-block rounded-full transition dark:text-red-500 border border-red-600"
                      id={idx}
                      onClick={(e) => handleRemove(e)}
                    >
                      <span className="sr-only">Remove badge</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        className="h-3 w-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          <div
            className={`flex flex-col w-full ${
              settings["ouput_type"] === "Linear" || settings["existing"]
                ? null
                : "hidden"
            }`}
          >
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">
              Target column
            </label>
            {settings.columns.map((column, idx) => (
              <div key={idx} className="pb-2">
                <label
                  htmlFor="Column"
                  className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                >
                  <div>
                    <p className="text-gray-700 dark:text-gray-200">
                      {column.column}
                    </p>

                    <p className="mt-1 text-xs font-light">{column.column}</p>
                  </div>

                  <input
                    className="size-5 border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900"
                    type="radio"
                    name={column.column}
                    disabled={settings["status"] === 1}
                    id={idx}
                    value={column.column}
                    checked={column.column === settings["target"]}
                    onChange={(event) => handleClick(event, "target")}
                  />
                </label>
              </div>
            ))}
          </div>

          <div
            className={`flex flex-col w-full pt-5 ${
              settings["ouput_type"] === "Linear" ? null : "hidden"
            }`}
          >
            <div className="flex flex-col">
              <label htmlFor="Shift" className="text-xs font-medium text-white">
                Shift rows
              </label>

              <div className="flex justify-center rounded border dark:border-gray-800 bg-gray-900">
                <button
                  type="button"
                  className="size-10 leading-10 text-gray-600 transition hover:opacity-75 dark:text-gray-300"
                  onClick={() =>
                    setSettings({ type: "shift", value: settings.shift - 1 })
                  }
                >
                  -
                </button>

                <input
                  type="number"
                  id="Shift"
                  value={settings.shift}
                  className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm dark:bg-gray-900 dark:text-white [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  className="size-10 leading-10 text-gray-600 transition hover:opacity-75 dark:text-gray-300"
                  onClick={() =>
                    setSettings({ type: "shift", value: settings.shift + 1 })
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex pt-5 w-full justify-end">
            <button
              className="inline-block rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              onClick={() => saveTarget()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Target;
