import { Studio } from "@libsqlstudio/gui";
import TursoDriver from "./driver.ts";
import "@libsqlstudio/gui/css";
import useSWR from "swr";

export default function App() {
  const { data: driver, error } = useSWR(
    "/api/credentials",
    async (url) => {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error("Failed to fetch credentials");
      }

      const credentials = await resp.json() as {
        url: string;
        authToken: string;
      };

      return new TursoDriver(
        credentials.url,
        credentials.authToken,
      );
    },
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!driver) {
    return <div>Loading...</div>;
  }

  return (
    <Studio
      driver={driver}
      name="Turso Connection"
      theme="light"
      color="blue"
    />
  );
}
