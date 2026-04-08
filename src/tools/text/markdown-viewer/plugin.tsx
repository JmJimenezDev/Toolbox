import { IoLogoMarkdown } from "react-icons/io5";

export default {
  name: "plugins.markdown-viewer.title",
  description: "plugins.markdown-viewer.description",
  path: "/markdown-viewer",
  category: "menu.text",
  icon: IoLogoMarkdown,
  component: () => import(".")
};