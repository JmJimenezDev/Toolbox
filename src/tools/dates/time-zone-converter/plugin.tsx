import { IoEarth } from "react-icons/io5";

export default {
  name: "plugins.time-zone-converter.title",
  description: "plugins.time-zone-converter.description",
  path: "/time-zone-converter",
  category: "menu.dates",
  icon: IoEarth,
  component: () => import(".")
};