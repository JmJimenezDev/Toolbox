import { createBrowserRouter } from "react-router-dom";
import { toolRoutes } from "./routes";
import { App } from '../../tools/App'
import { createElement } from "react";
import { Home } from "../layout/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: createElement(App),
    children: [
      {
        index: true,
        element: createElement(Home)
      },
      ...toolRoutes
    ]
  }
]);