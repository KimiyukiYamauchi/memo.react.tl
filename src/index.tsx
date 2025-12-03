import ReactDOOM from "react-dom/client";
import { App } from "./App";

const root = ReactDOOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
