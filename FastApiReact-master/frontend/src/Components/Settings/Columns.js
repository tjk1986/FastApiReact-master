// Imports
import { useEffect } from "react";

// Store
import { useGetData } from "../../store/store";

function Columns() {
  const file = useGetData((state) => state.fileSelected);
  const settings = useGetData((state) => state.settings);
  const getSettings = useGetData((state) => state.getSettings);
  const setColumns = useGetData((state) => state.setColumns);

  useEffect(() => {
    getSettings(file);
  }, []);

  const handleClick = (event, payload) => {
    event.target.blur();
    setColumns(payload);
  };

  const FieldType = ({ type, index }) => (
    <div>
      <label htmlFor="Categorical" className="flex items-start gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="size-4 rounded-full border-gray-600 bg-gray-800 ring-offset-gray-900 cursor-pointer"
            id="Categorical"
            value={index}
            checked={type === "Categorical"}
            disabled={settings["status"] === 1}
            onChange={(e) =>
              handleClick(e, {
                type: "type",
                index: e.target.value,
                value: "Categorical",
              })
            }
          />
        </div>

        <div className="flex items-center">Categorical</div>
      </label>
      <label htmlFor="Linear" className="flex items-start gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="size-4 rounded-full border-gray-600 bg-gray-800 ring-offset-gray-900 cursor-pointer"
            id="Linear"
            value={index}
            disabled={settings["status"] === 1}
            checked={type === "Linear"}
            onChange={(e) =>
              handleClick(e, {
                type: "type",
                index: e.target.value,
                value: "Linear",
              })
            }
          />
        </div>

        <div>Linear</div>
      </label>
      <label htmlFor="Text" className="flex items-start gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="size-4 rounded-full border-gray-600 bg-gray-800 ring-offset-gray-900 cursor-pointer"
            id="Text"
            value={index}
            disabled={settings["status"] === 1}
            checked={type === "Text"}
            onChange={(e) =>
              handleClick(e, {
                type: "type",
                index: e.target.value,
                value: "Text",
              })
            }
          />
        </div>

        <div>Text</div>
      </label>
    </div>
  );

  const Toggle = ({ value, index }) => (
    <label
      htmlFor={index}
      className="relative h-7 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-blue-600"
    >
      <input
        type="checkbox"
        id={index}
        checked={value}
        value={value}
        disabled={settings["status"] === 1}
        onChange={(e) =>
          handleClick(e, {
            type: "training",
            index: index,
            value: e.target.checked,
          })
        }
        className="peer sr-only"
      />

      <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
    </label>
  );

  return (
    <div className="flex flex-col gap-4 h-full w-[calc(w-full-10px)] m-5 overflow-hidden">
      <div className="flex justify-center">
        <div className="grid grid-cols-3 w-[90%]">
          <h2 className="flex items-center justify-center gap-2 text-base">
            Column
          </h2>
          <h2 className="flex items-center justify-center gap-2 text-base">
            Type
          </h2>
          <h2 className="flex items-center justify-center gap-2 text-base">
            Training source
          </h2>
        </div>
        <span className="relative flex justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>
        </span>
      </div>

      <div className=" abc flex flex-col gap-2 h-full pb-5 justify-center items-center overflow-y-auto">
        <div className="flex flex-col gap-2 h-full w-[90%] text-white font-medium">
          {settings.columns.map((column, idx) => {
            if (!["label", "pred"].includes(column.column))
              return (
                <div
                  key={idx}
                  className="grid grid-cols-3 bg-gray-900 py-6 px-2 rounded-md hover:bg-gray-800"
                >
                  <label
                    htmlFor={column.column}
                    className="flex items-center justify-center gap-2"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="size-4 rounded-md border-gray-600 bg-gray-800 ring-offset-gray-900 cursor-pointer"
                        id={column.column}
                        checked={column.visible}
                        value={column.visible}
                        onChange={(e) =>
                          handleClick(e, {
                            type: "visible",
                            index: idx,
                            value: e.target.checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center">{column.column}</div>
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    <FieldType type={column.type} index={idx} />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Toggle value={column.training} index={idx} />
                  </div>
                </div>
              );
          })}
          <span className="relative flex justify-center">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-75"></div>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Columns;
