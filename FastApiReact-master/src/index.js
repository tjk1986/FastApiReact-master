const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let fastApiProcess;

function startFastApiServer(callback) {
  const filePath = path.join(
    __dirname,
    "../backendFast/build/exe.linux-x86_64-3.10/main"
  );
  fastApiProcess = spawn(filePath);

  fastApiProcess.on("error", (err) => {
    console.error("Failed to start Fast API server:", err);
  });

  fastApiProcess.stdout.on("data", (data) => {
    if (data.toString().includes("Uvicorn running")) {
      callback(); // Call the callback function when the server is running
    }
  });

  fastApiProcess.stderr.on("data", (data) => {
    console.error(`Fast API Server Error: ${data}`);
    if (data.toString().includes("Uvicorn running")) {
      callback(); // Call the callback function when the server is running
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
    autoHideMenuBar: true,
  });

  // Load the React application
  mainWindow.loadFile(path.join(__dirname, "../frontend/build/index.html"));

  // Open DevTools
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
    // Stop the Fast API server when Electron app is closed
    fastApiProcess.kill();
    app.quit(); // Quit Electron app when the main window is closed
  });
}

app.on("ready", () => {
  startFastApiServer(() => {
    createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
