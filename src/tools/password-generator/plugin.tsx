import { IoShieldHalf } from "react-icons/io5";

export default {
  name: "plugins.password-generator.title",
  description: "plugins.password-generator.description",
  path: "/password-generator",
  icon: IoShieldHalf,
  component: () => import(".")
};