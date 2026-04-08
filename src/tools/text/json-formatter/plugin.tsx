import { LuBraces } from "react-icons/lu";

export default {
    name: "plugins.json-formatter.title",
    description: "plugins.json-formatter.description",
    path: "/json-formatter",
    category: "menu.text",
    icon: LuBraces,
    component: () => import(".")
};