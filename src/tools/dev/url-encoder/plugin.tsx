import { IoLink } from "react-icons/io5";

export default {
  name: "plugins.url-encoder.title",
  description: "plugins.url-encoder.description",
  path: "/url-encoder",
  category: "menu.dev",
  icon: IoLink,
  component: () => import(".")
};