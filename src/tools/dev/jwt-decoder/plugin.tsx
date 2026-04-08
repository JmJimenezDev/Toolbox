import { IoKeyOutline } from "react-icons/io5";

export default {
    name: "plugins.jwt-decoder.title",
    description: "plugins.jwt-decoder.description",
    path: "/jwt-decoder",
    category: "menu.dev",
    icon: IoKeyOutline,
    component: () => import(".")
};