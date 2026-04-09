import { useLocation } from "react-router-dom";
import { plugins } from "./pluginLoader";

export const useCurrentPlugin = () => {
    const location = useLocation();
    return plugins.find(p => p.path === location.pathname);
};