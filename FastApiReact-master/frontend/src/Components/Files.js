// Rect
import { useEffect } from "react";

// Store
import { useGetData } from "../store/store";

import Status from "./Status";

export default function Files() {
  const getFiles = useGetData((state) => state.getFiles);
  const files = useGetData((state) => state.files);
  const getFile = useGetData((state) => state.getFile);
  const getAllSettings = useGetData((state) => state.getAllSettings);
  const setModalData = useGetData((state) => state.setModalData);
  const selectedFile = useGetData((state) => state.fileSelected);
  const testFiles = useGetData((state) => state.testFiles);

  useEffect(() => {
    getFiles();
    getAllSettings();
  }, []);

  const handleClose = (name) => {
    setModalData({ modal: "deleteModal", type: "open", value: true });
    setModalData({ modal: "deleteModal", type: "fileName", value: name });
  };

  if (Array.isArray(files))
    return (
      <div className="container my-5 w-full h-full overflow-y-auto">
        <div className={`text-xs ${files.length === 0 ? "hidden" : null}`}>
          Train files
        </div>
        <ul className="gap-6 pb-4">
          {files.map((file, idx) => {
            return (
              <div
                key={idx}
                className="flex flex-row w-full px-10 mb-2 justify-end items-center bg-gray-900 hover:bg-gray-800 rounded-lg"
              >
                <li
                  className="flex justify-between py-5 hover:text-slate-300 cursor-pointer flex-grow"
                  onClick={() =>
                    getFile({ file: file["File Name"], type: "Train" })
                  }
                >
                  <div className="flex min-w-0 gap-x-4 flex-grow">
                    <div className="h-12 w-12 inline-flex rounded-full bg-green-600 items-center justify-center">
                      <Excel />
                    </div>
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6">
                        {file["File Name"]}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5">
                        {file["Size (KB)"]}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6">{file["File Type"]}</p>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <Status file={file["File Name"]} />
                      <time className="text-xs leading-5">
                        {file["Creation Date"]}
                      </time>
                    </div>
                  </div>
                </li>
                <div
                  className="flex flex-col items-center justify-center w-20 cursor-pointer"
                  onClick={() => handleClose(file["File Name"])}
                >
                  <Delete />
                </div>
              </div>
            );
          })}
        </ul>
        <div
          className={`text white text-xs ${
            testFiles.length === 0 ? "hidden" : null
          }`}
        >
          Test files
        </div>
        <ul className="gap-6">
          {testFiles.map((file, idx) => {
            return (
              <div
                key={idx}
                className="flex flex-row w-full px-10 mb-2 justify-end items-center bg-gray-900 hover:bg-gray-800 rounded-lg"
              >
                <li
                  className="flex justify-between py-5 hover:text-slate-300 cursor-pointer flex-grow"
                  onClick={() =>
                    getFile({ file: file["File Name"], type: "Test" })
                  }
                >
                  <div className="flex min-w-0 gap-x-4 flex-grow">
                    <div className="h-12 w-12 inline-flex rounded-full bg-green-600 items-center justify-center">
                      <Excel />
                    </div>
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6">
                        {file["File Name"]}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5">
                        {file["Size (KB)"]}
                      </p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6">{file["File Type"]}</p>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      <Status file={file["File Name"]} test={true} />
                      <time className="text-xs leading-5">
                        {file["Creation Date"]}
                      </time>
                    </div>
                  </div>
                </li>
                <div
                  className="flex flex-col items-center justify-center w-20 cursor-pointer"
                  onClick={() => handleClose(file["File Name"])}
                >
                  <Delete />
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    );
  return null;
}

const Excel = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
      />
    </svg>
  );
};

const Delete = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-red-900 hover:text-red-800"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
};
