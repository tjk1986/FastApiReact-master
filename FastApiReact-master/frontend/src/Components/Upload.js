import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useGetData } from "../store/store";

export default function App() {
  const [hover, setHover] = useState(false);
  const setModalData = useGetData((state) => state.setModalData);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    // uploadData(acceptedFiles[0]);
    setModalData({
      modal: "uploadModal",
      type: "file",
      value: acceptedFiles[0],
    });
    setModalData({
      modal: "uploadModal",
      type: "fileName",
      value: acceptedFiles[0].name,
    });
    setModalData({ modal: "uploadModal", type: "open", value: true });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <form className="flex flex-column w-full justify-center items-center">
      <div
        {...getRootProps()}
        onMouseEnter={() => setHover(!hover)}
        onMouseLeave={() => setHover(!hover)}
        className={`container sm text-center rounded-lg py-10 cursor-pointer border bg-gray-900 ${
          hover ? "text-slate-300 border-slate-800" : "border-slate-800"
        }`}
      >
        <input {...getInputProps()} />
        <div className="pb-5">
          <span
            className={`inline-flex items-center justify-center p-2 rounded-md ${
              hover ? "bg-blue-500" : "bg-blue-600"
            }`}
          >
            <PhotoIcon />
          </span>
        </div>
        <div className="text-sm leading-6">
          <span
            className={`relative font-semibold ${
              hover ? "text-blue-500" : "text-blue-600"
            }`}
          >
            Upload a file
          </span>
          <span className="pl-1">or drag and drop</span>
        </div>
        <p className="text-xs leading-5">XLSX, XLS, CSV</p>
      </div>
    </form>
  );
}

const PhotoIcon = () => {
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
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
};
