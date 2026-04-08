import { IoColorPalette } from "react-icons/io5";

export default {
  name: "plugins.color-converter.title",
  description: "plugins.color-converter.description",
  path: "/color-converter",
  category: "menu.dev",
  icon: IoColorPalette,
  component: () => import(".")
};