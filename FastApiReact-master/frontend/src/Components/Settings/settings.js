// Store
import { useGetData } from "../../store/store";

// Components
import Tabs from "./Tabs";
import Columns from "./Columns";
import { CopyClipboard } from "../CopyClipboard";
import Status from "../Status";
import Target from "./Target";
import Model from "./Model";

function Settings() {
  const tab = useGetData((state) => state.tab);
  const file = useGetData((state) => state.fileSelected);

  const getContent = () => {
    switch (tab) {
      case "columns":
        return <Columns />;
      case "target":
        return <Target />;
      case "model":
        return <Model />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden rounded-lg border border-slate-800">
      <Tabs />
      <div className="flex w-full justify-center gap-2 pt-4">
        <Status file={file} />
        <h1 className="text-xs font-medium">{file}</h1>
        <CopyClipboard file={file} />
      </div>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-slate-800"></span>
      </span>
      {getContent()}
    </div>
  );
}

export default Settings;
