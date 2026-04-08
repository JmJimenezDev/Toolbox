import { IoLockClosed } from "react-icons/io5";

export default {
  name: "plugins.base64.title",
  description: "plugins.base64.description",
  path: "/base64-encoder",
  category: "menu.dev",
  icon: IoLockClosed,
  component: () => import(".")
};