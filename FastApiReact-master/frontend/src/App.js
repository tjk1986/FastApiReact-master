// CSS
import "./App.css";

// Components
import Upload from "./Components/Upload";
import Files from "./Components/Files";
import Sidebar from "./Components/SideBar";
import VirtualTable from "./Components/Table/virtualTable";
import Settings from "./Components/Settings/settings";
import Test from "./Components/Test/Test";

import Alert from "./Components/Alert";
import Loading from "./Components/Loading";
import UploadModal from "./Components/UploadModal";
import DeleteModal from "./Components/DeleteModal";

// Store
import { useGetData } from "./store/store";

function App() {
  const page = useGetData((state) => state.page);
  const loading = useGetData((state) => state.loading);
  const uploadModalOpen = useGetData((state) => state.uploadModal.open);
  const deleteModalOpen = useGetData((state) => state.deleteModal.open);

  const getContent = () => {
    switch (page) {
      case "table":
        return <VirtualTable />;
      case "workspace":
        return (
          <>
            <Upload /> <Files />
          </>
        );
      case "settings":
        return <Settings />;

      case "test":
        return <Test />;

      default:
        return (
          <>
            <Upload /> <Files />
          </>
        );
    }
  };

  return (
    <div className="h-screen text-slate-400 bg-slate-900 overflow-y-hidden text-sm">
      <Alert />
      {loading ? <Loading /> : null}
      {uploadModalOpen ? <UploadModal /> : null}
      {deleteModalOpen ? <DeleteModal /> : null}

      <div className="grid grid-cols-[50px_auto] h-full w-full">
        <div className="flex">
          <Sidebar />
        </div>
        <div className="flex flex-col p-10 w-full h-full justify-start items-center overflow-hidden">
          {getContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
