import type { IPlugin } from "../types/plugin";

const modules = import.meta.glob("../tools/**/plugin.tsx", { eager: true });

export const plugins: IPlugin[] = Object.values(modules).map((m: any) => m.default);