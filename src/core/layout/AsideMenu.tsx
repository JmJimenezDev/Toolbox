import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { IPlugin } from '../../types/plugin';
import { plugins } from '../../utils/pluginLoader';
import clsx from "clsx";
import { IoCaretDown, IoSwapHorizontal } from "react-icons/io5";

export const AsideMenu = React.memo(() => {
    const { t } = useTranslation();
    const location = useLocation();
    const activeSection = location.pathname;

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
    const toggleSection = (category: string) => {
        setOpenSections(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const closeAllExceptActive = () => {
        let activeCategory: string | null = null;
        for (const [category, pluginsInCategory] of Object.entries(groupedPlugins)) {
            if (pluginsInCategory.some(plugin => plugin.path === activeSection)) {
                activeCategory = category;
                break;
            }
        }

        const newOpenSections: Record<string, boolean> = {};
        if (activeCategory) {
            newOpenSections[activeCategory] = true;
        }
        setOpenSections(newOpenSections);
    };

    const groupedPlugins = plugins.reduce((acc, plugin) => {
        const category = plugin.category || t("menu.utilities");
        if (!acc[category]) acc[category] = [];
        acc[category].push(plugin);
        return acc;
    }, {} as Record<string, IPlugin[]>);

    return <div className="flex flex-col justify-between flex-1 py-10 px-5">
        <div className="overflow-y-auto max-h-160">
            <div className="mb-5 flex justify-end">
                {activeSection !== "/" && <button onClick={closeAllExceptActive} className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400">
                    <IoSwapHorizontal className="text-lg" />
                </button>}
            </div>
            {Object.entries(groupedPlugins).map(([category, plugins]) => (
                <div key={category} className="mb-4">
                    <h3 onClick={() => toggleSection(category)} className="text-neutral-700 dark:text-neutral-300 underline cursor-pointer flex justify-between items-center select-none">
                        {t(category)}
                        <span className={clsx("mr-3 transition-transform duration-300", openSections[category] && "rotate-180")}>
                            <IoCaretDown className="text-lg" />
                        </span>
                    </h3>

                    <ul className={clsx("mt-3 space-y-1 overflow-hidden transition-[max-height] duration-700 ease-in-out", openSections[category] ? "max-h-250" : "max-h-0")}>
                        {plugins.map((plugin) => <li key={plugin.name}
                            className={clsx(
                                "border-l pl-6 py-3",
                                activeSection === plugin.path
                                    ? "border-green-600 dark:border-green-500 text-black dark:text-white"
                                    : "border-neutral-500 text-neutral-600 dark:text-neutral-400"
                            )}>
                            <NavLink to={plugin.path} className="hover:text-neutral-900 dark:hover:text-neutral-300 flex items-center gap-2">
                                <plugin.icon /> {t(plugin.name)}
                            </NavLink>
                        </li>)}
                    </ul>
                </div>
            ))}
        </div>

        <div>
            <h3 className="text-neutral-700 dark:text-neutral-300 underline mt-6">{t("menu.made-by")}</h3>
            <ul className="mt-3 space-y-1">
                <li className="border-l pl-6 py-3 border-neutral-500 text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                    <Link to="https://jmjimenez.dev" target="_blank" rel="noopener noreferrer"
                        className="hover:text-neutral-900 dark:hover:text-neutral-300 flex items-center gap-2">
                        👨🏼‍💻 <span>JmJimenez.dev</span>
                    </Link>
                </li>
            </ul>
        </div>
    </div>
})
