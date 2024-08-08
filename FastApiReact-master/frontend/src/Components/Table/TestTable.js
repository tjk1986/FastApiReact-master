// React
import { TableVirtuoso } from "react-virtuoso";
import { useState } from "react";

// Store
import { useGetData } from "../../store/store";

// trained_model: str; testModel
// test_data: str;

export default function TestTable() {
  const test_data = useGetData((state) => state.fileSelected);
  const testModel = useGetData((state) => state.testModel);

  const tableData = useGetData((state) => state.data);
  const schema = tableData.schema.fields;
  const columns = schema.map((column) => column.name);
  const rows = tableData.data;
  const [model, setModel] = useState("");

  const files = useGetData((state) => state.files);

  console.log(tableData);

  const headerContent = (index) => (
    <tr
      key={index}
      className="bg-gray-900 uppercase font-sans text-sm min-w-[120px] text-slate-200"
    >
      {columns.map((column, idx) => {
        return (
          <th key={idx} className="min-w-[120px]">
            {column}
          </th>
        );
      })}
    </tr>
  );

  const items = (index) =>
    columns.map((column) => {
      const payload = rows[index][column];
      return <td className="text-sm p-2 hover:text-slate-200">{payload}</td>;
    });

  const HandleSelect = (e) => {
    setModel(e.target.value);
    e.target.blur();
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="h-full w-full justify-center p-10 border-r border-slate-800 overflow-hidden">
        <TableVirtuoso
          className="h-full"
          data={rows}
          totalCount={rows.length}
          fixedHeaderContent={headerContent}
          itemContent={items}
        />
      </div>
      <div className="flex flex-col gap-4 px-10 pt-5">
        <div>
          <span className="text-white text-xs">Select trained model</span>
          {files.map((file, index) => (
            <div key={index} className="pb-2">
              <label
                htmlFor="Model"
                className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
              >
                <div>
                  <p className="text-gray-700 dark:text-gray-200">
                    {file["File Name"]}
                  </p>

                  <p className="mt-1 text-xs font-light">{file["Size (KB)"]}</p>
                </div>

                <input
                  className="size-5 border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900"
                  type="radio"
                  name={file["File Name"]}
                  // disabled={value.disabled}
                  id={index}
                  value={file["File Name"]}
                  checked={file["File Name"] === model}
                  onChange={(event) => HandleSelect(event)}
                />
              </label>
            </div>
          ))}
        </div>
        <button
          className="inline-block rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
          onClick={() =>
            testModel({ test_data: test_data, trained_model: model })
          }
        >
          Predict
        </button>
      </div>
    </div>
  );
}
