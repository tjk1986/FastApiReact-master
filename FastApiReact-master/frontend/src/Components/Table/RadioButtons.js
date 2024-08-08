// Store
import { useGetData } from "../../store/store";

const RadioButtons = ({ column, value, index }) => {
  const labels = useGetData((state) => state.settings.labels);
  const updateData = useGetData((state) => state.update);
  const rows = useGetData((state) => state.data.data);
  const target = useGetData((state) => state.settings.target);

  const handleClick = (index, event) => {
    updateData(index, event.target.value);
    event.target.blur();
  };

  return (
    <td key={index} className="p-2">
      {labels.map((item) => (
        <label htmlFor={item} className="flex items-start gap-4 pb-1">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="size-5 rounded-full border-gray-600 bg-gray-800 ring-offset-gray-900 cursor-pointer"
              id={item}
              value={item}
              disabled={
                index !== 0 &&
                (rows[index - 1][target] === null ||
                  rows[index - 1][target] === "")
              }
              checked={item === value}
              onChange={(event) => handleClick(index, event)}
            />
          </div>

          <div>{item}</div>
        </label>
      ))}
    </td>
  );
};

export default RadioButtons;
