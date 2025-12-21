import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./utils/chromeExtensionFix.ts";

createRoot(document.getElementById("root")!).render(<App />);
