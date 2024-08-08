// Store
import { useGetData } from "../store/store";

function UploadModal({ file }) {
  const modalData = useGetData((state) => state.uploadModal);
  const setModalData = useGetData((state) => state.setModalData);
  const uploadData = useGetData((state) => state.upload);

  const handleClose = () => {
    setModalData({ modal: "uploadModal", type: "open", value: false });
    setModalData({ modal: "uploadModal", file: "file", value: null });
    setModalData({ modal: "uploadModal", type: "fileName", value: "" });
    setModalData({ modal: "uploadModal", type: "type", value: "" });
  };

  const onSave = () => {
    setModalData({ modal: "uploadModal", type: "open", value: false });
    uploadData(modalData.file);
  };

  return (
    <div className="flex absolute w-full h-full justify-center items-center z-50">
      <div className="flex flex-col bg-gray-900 border border-gray-800 rounded-md p-5">
        <div className="flex">
          <h1 className="flex w-full justify-center text-white text-xl min-w-[400px]">
            Upload
          </h1>
          <button className="float-right" onClick={handleClose}>
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
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>

        <div className="pb-4">
          <label
            htmlFor="target"
            className="block text-xs font-medium text-gray-700 dark:text-gray-200"
          >
            Filename
          </label>

          <input
            type="text"
            id="target"
            placeholder="Filename..."
            className="w-full rounded-md border-gray-200 pe-10 shadow-sm sm:text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
            value={modalData.fileName}
            onChange={(e) =>
              setModalData({
                modal: "uploadModal",
                type: "fileName",
                value: e.target.value,
              })
            }
          />
        </div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-200 pb-1">
          Test size
        </label>

        <div className="pb-2">
          <label
            htmlFor="10%"
            className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <div>
              <p className="text-gray-700 dark:text-gray-200">10%</p>
            </div>

            <input
              className="size-5 border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900"
              type="radio"
              name="10%"
              id="10%"
              value={modalData.test_size}
              checked={modalData.test_size === 0.1}
              onChange={(event) =>
                setModalData({
                  modal: "uploadModal",
                  type: "test_size",
                  value: 0.1,
                })
              }
            />
          </label>
        </div>

        <div className="pb-10">
          <label
            htmlFor="20%"
            className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          >
            <div>
              <p className="text-gray-700 dark:text-gray-200">20%</p>
            </div>

            <input
              className="size-5 border-gray-300 text-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:ring-offset-gray-900"
              type="radio"
              name="20%"
              id="20%"
              value={modalData.test_size}
              checked={modalData.test_size === 0.2}
              onChange={(event) =>
                setModalData({
                  modal: "uploadModal",
                  type: "test_size",
                  value: 0.2,
                })
              }
            />
          </label>
        </div>

        <button
          className="inline-block rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
          onClick={onSave}
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default UploadModal;
