// Store
import { useGetData } from "../store/store";

function DeleteModal({ file }) {
  const modalData = useGetData((state) => state.deleteModal);
  const setModalData = useGetData((state) => state.setModalData);
  const deleteFile = useGetData((state) => state.delete);

  const handleClose = () => {
    setModalData({ modal: "deleteModal", type: "open", value: false });
    setModalData({ modal: "deleteModal", type: "fileName", value: "" });
  };

  const handleDelete = () => {
    setModalData({ modal: "deleteModal", type: "open", value: false });
    deleteFile(modalData.fileName);
    setModalData({ modal: "deleteModal", type: "fileName", value: "" });
  };

  return (
    <div className="flex absolute w-full h-full justify-center items-center z-50">
      <div className="flex flex-col bg-gray-900 border border-gray-800 rounded-md p-5 max-w-[500px]">
        <div className="flex pb-5">
          <h1 className="flex w-full justify-center text-white text-xl min-w-[400px]">
            Delete
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
        <div className="pb-5">
          Deleting a file and all related content is a permanent action that
          cannot be undone. It's important to ensure that you have saved any
          necessary information or backed up relevant data before proceeding.
          Once confirmed, the deletion process will remove the file from the
          system and free up the associated storage space. Always double-check
          that you are deleting the correct file to prevent any unintended loss
          of data.
        </div>
        {file}
        <button
          className="inline-block rounded border border-red-700 bg-red-800 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-blue-500"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
