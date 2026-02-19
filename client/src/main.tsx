import { createRoot } from "react-dom/client";
import App from "./App";
import "leaflet/dist/leaflet.css";   // ✅ 이 줄 추가
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
