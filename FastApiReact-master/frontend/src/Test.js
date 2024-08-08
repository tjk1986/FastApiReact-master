import { useState } from "react";

const { ipcRenderer } = window.electron;

function FileInput() {
  const [filePath, setFilePath] = useState("");

  const handleFileChange = (e) => {
    const path = URL.createObjectURL(e.target.files[0]);
    setFilePath(path);
  };

  const getFileFromElectron = () => {
    ipcRenderer.send("get-file-path");
    ipcRenderer.on("file-path", (event, filePath) => {
      console.log("File path:", filePath);
      // Update state or perform other actions with the file path
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => getFileFromElectron()}></button>
      <p>File path: {filePath}</p>
    </div>
  );
}

export default FileInput;
