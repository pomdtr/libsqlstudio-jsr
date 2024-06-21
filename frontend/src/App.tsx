import { Studio } from "@libsqlstudio/gui";
import TursoDriver from "./driver.ts";
import "@libsqlstudio/gui/css";

export default function App() {
  return (
    <Studio
      driver={new TursoDriver()}
      name="Turso Connection"
      theme="light"
      color="blue"
    />
  );
}
