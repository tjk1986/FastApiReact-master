// Store
import { useGetData } from "../../store/store";

// Components
import Status from "../Status";
import { CopyClipboard } from "../CopyClipboard";
import TestTable from "../Table/TestTable";

function Test() {
  const file = useGetData((state) => state.fileSelected);

  return (
    <div className="flex flex-col gap-2 w-full h-[calc(100vh-80px)] rounded-lg overflow-hidden border border-slate-800">
      <div className="flex justify-center pt-2 text-white text-xl">Test</div>
      <div className="flex justify-center items-center gap-2">
        <Status file={file} />
        <h1 className="text-xs font-medium">{file}</h1>
        <CopyClipboard file={file} />
      </div>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-slate-800"></span>
      </span>
      <TestTable />
    </div>
  );
}

export default Test;
