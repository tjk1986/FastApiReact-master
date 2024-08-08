// React
import { TableVirtuoso } from "react-virtuoso";

// Components
import Loading from "./Loading";
import RadioButtons from "./RadioButtons";

// Store
import { useGetData } from "../../store/store";

export default function VirtualTable() {
  const tableData = useGetData((state) => state.data);
  const columnsData = useGetData((state) => state.settings.columns);

  const settings = useGetData((state) => state.settings);
  const updateData = useGetData((state) => state.update);
  const loading = useGetData((state) => state.loading);

  const target = useGetData((state) => state.settings.target);

  const predict = useGetData((state) => state.predict);

  const schema = tableData.schema.fields;
  const columns = schema.map((column) => column.name);
  const rows = tableData.data;

  const filteredColumns = columnsData.map((column) => {
    return column.visible ? column.column : null;
  });

  const PredField = (payload, index) => (
    <td
      onClick={() => updateData(index, payload)}
      className="text-sm p-2 cursor-pointer"
    >
      {payload}
    </td>
  );

  const headerContent = (index) => (
    <tr
      key={index}
      className="bg-gray-900 uppercase font-sans text-sm min-w-[120px] text-slate-200"
    >
      {columns.map((column, idx) => {
        if (filteredColumns.includes(column) || target === column) {
          return (
            <th key={idx} className="min-w-[120px]">
              {column}
            </th>
          );
        }
        return null;
      })}
    </tr>
  );

  const selectColumn = (column, payload, index) => {
    switch (true) {
      case column === "pred" && loading:
        return (
          <td className="text-sm p-2">
            <div className="flex flex-col h-full w-full justify-center items-center align-center">
              <Loading h={4} w={4} />
            </div>
          </td>
        );
      case column === "pred":
        return PredField(payload, index);
      case column === target &&
        settings.ouput_type === "Categorical" &&
        !settings.existing:
        return <RadioButtons column={column} value={payload} index={index} />;
      default:
        return <td className="text-sm p-2 hover:text-slate-200">{payload}</td>;
    }
  };

  const items = (index) =>
    columns.map((column) => {
      if (filteredColumns.includes(column) || target === column) {
        const payload = rows[index][column];
        return selectColumn(column, payload, index);
      }
      return null;
    });

  return (
    <div className="h-full w-full p-10 rounded-lg border border-slate-800 overflow-hidden">
      <TableVirtuoso
        className="h-[calc(h-full-50px)] w-full"
        data={rows}
        totalCount={rows.length}
        fixedHeaderContent={headerContent}
        itemContent={items}
      />
      {settings.ouput_type === "Linear" || settings.existing ? (
        <div className="absolute right-[120px] bottom-[120px] z-10">
          <button
            className="inline-block rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-slate-900 hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
            onClick={() => predict()}
          >
            Train model
          </button>
        </div>
      ) : null}
    </div>
  );
}
