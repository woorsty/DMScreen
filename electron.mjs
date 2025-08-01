import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl =
    process.env.VITE_DEV_SERVER_URL ||
    url.format({
      pathname: path.join(__dirname, "dist/index.html"),
      protocol: "file:",
      slashes: true,
    });

  console.log("Loading URL:", startUrl);

  win.loadURL(startUrl);

  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error("Failed to load:", validatedURL, errorDescription);
    }
  );
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
