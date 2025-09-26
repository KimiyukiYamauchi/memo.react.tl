import ReactDOOM from "react-dom/client";
import { App } from "./components/App";

const root = ReactDOOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
