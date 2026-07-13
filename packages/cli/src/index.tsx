import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { RootLayout } from "./components/layouts/root-layout";
import { Home } from "./screens/home";
import NewSession from "./screens/new-session";
import Session from "./screens/session";

const router = createMemoryRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "sessions/new",
        element: <NewSession />,
      },
      {
        path: "sessions/:id",
        element: <Session />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

const renderer = await createCliRenderer({
  exitOnCtrlC: false,
  targetFps: 60,
});
createRoot(renderer).render(<App />);
