import { IoQrCodeOutline } from "react-icons/io5";

export default {
  name: "plugins.qr-generator.title",
  description: "plugins.qr-generator.description",
  path: "/qr-generator",
  icon: IoQrCodeOutline,
  component: () => import(".")
};