import { lazy, Suspense } from "react";
import { plugins } from "../../utils/pluginLoader";
import type { IPlugin } from "../../types/plugin";
import type { RouteObject } from "react-router-dom";
import { Loader } from "../layout/Loader";

export const toolRoutes: RouteObject[] = plugins.map((plugin: IPlugin) => {
  const Component = lazy(plugin.component);

  return {
    path: plugin.path,
    element: (
      <Suspense fallback={<Loader />}>
        <Component />
      </Suspense>
    )
  };
});