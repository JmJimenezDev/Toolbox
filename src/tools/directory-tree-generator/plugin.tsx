import { IoGitBranchOutline } from "react-icons/io5";

export default {
  name: "plugins.directory-tree-generator.title",
  description: "plugins.directory-tree-generator.description",
  path: "/directory-tree-generator",
  icon: IoGitBranchOutline,
  component: () => import(".")
};