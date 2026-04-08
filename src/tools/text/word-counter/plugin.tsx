import { IoText } from "react-icons/io5";

export default {
  name: "plugins.word-counter.title",
  description: "plugins.word-counter.description",
  path: "/word-counter",
  category: "menu.text",
  icon: IoText,
  component: () => import(".")
};