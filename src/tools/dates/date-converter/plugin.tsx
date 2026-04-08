import { IoCalendarOutline } from "react-icons/io5";

export default {
  name: "plugins.date-converter.title",
  description: "plugins.date-converter.description",
  path: "/date-converter",
  category: "menu.dates",
  icon: IoCalendarOutline,
  component: () => import(".")
};