// Store
import { useGetData } from "../store/store";

function Status({ file, test }) {
  const settings = useGetData((state) => state.all_settings);
  const idx = settings.findIndex((item) => item.file === file);

  const getState = () => {
    if (idx === -1) return 3;
    return settings[idx].status;
  };

  const status = getState();

  const createClassName = () => {
    if (test) return { light: "bg-slate-50/20", dark: "bg-slate-50" };

    switch (status) {
      case 0:
        return { light: "bg-red-800/20", dark: "bg-red-800" };
      case 1:
        return { light: "bg-amber-500/20", dark: "bg-amber-500" };
      case 2:
        return { light: "bg-emerald-500/20", dark: "bg-emerald-500" };
      default:
        return { light: "bg-slate-50/20", dark: "bg-slate-50" };
    }
  };

  return (
    <div className={`flex-none rounded-full p-1 ${createClassName()["light"]}`}>
      <div
        className={`h-1.5 w-1.5 rounded-full  ${createClassName()["dark"]}`}
      />
    </div>
  );
}

export default Status;
