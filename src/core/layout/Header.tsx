import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCloseOutline, IoMenuOutline, IoMoonOutline, IoSunnyOutline, IoTvOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import flagES from "../../assets/flags/spain.png";
import flagGB from "./../../assets/flags/united-kingdom.png";
import { AsideMenu } from "./AsideMenu";
import LogoToolbox from "../../assets/logo-toolbox.webp";

export const Header = () => {
    const { t, i18n } = useTranslation();
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const dropdownLanguageRef = useRef<HTMLDivElement | null>(null);
    const dropdownThemeRef = useRef<HTMLDivElement | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const [theme, setTheme] = useState<string>(() => {
        const storedTheme = localStorage.getItem("selectedTheme") || "system";
        if (storedTheme === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return storedTheme;
    });

    const handleLanguageSelection = (language: string) => {
        localStorage.setItem("selectedLanguage", language);
        i18n.changeLanguage(language);
        setLanguageDropdownOpen(false);
    };

    const handleThemeSelection = (newTheme: string) => {
        localStorage.setItem("selectedTheme", newTheme);

        if (newTheme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            setTheme(systemTheme);
            if (systemTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else {
            setTheme(newTheme);
            if (newTheme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }

        setThemeDropdownOpen(false);
    };

    const getFlagIcon = (language: string) => {
        switch (language) {
            case "es_ES":
                return flagES;
            case "en_GB":
                return flagGB;
            default:
                return flagES;
        }
    };

    useEffect(() => {
        const selectedTheme = localStorage.getItem("selectedTheme") || "system";
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const effectiveTheme = selectedTheme === "system" ? systemTheme : selectedTheme;

        if (effectiveTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        const selectedLanguage = localStorage.getItem("selectedLanguage");
        if (selectedLanguage) {
            i18n.changeLanguage(selectedLanguage);
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownLanguageRef.current && !dropdownLanguageRef.current.contains(event.target as Node) &&
                dropdownThemeRef.current && !dropdownThemeRef.current.contains(event.target as Node)
            ) {
                setLanguageDropdownOpen(false);
                setThemeDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [i18n]);

    return <header className="border-b border-neutral-300 dark:border-neutral-800 py-5 px-5 text-black dark:text-white dark:bg-neutral-900 bg-gray-100 sticky top-0 z-50">
        <div className="flex justify-between items-center container mx-auto px-5 md:px-0">
            <Link to="/" className="hidden md:flex justify-center items-center gap-3">
                <img src={LogoToolbox} alt={t("commons.logo-toolbox")} className="size-7" />
                <h2 className="text-lg md:text-xl font-bold">JmJimenezToolbox</h2>
            </Link>

            <div className="md:hidden">
                <button
                    title={t("alts.open-menu")}
                    className="cursor-pointer hover:scale-110 h-6 max-h-10 w-6 max-w-10 select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    onClick={toggleMobileMenu}
                    type="button"
                >
                    <IoMenuOutline className="size-7" />
                </button>
            </div>

            <div className={`border-neutral-300 dark:border-neutral-800 text-black dark:text-white dark:bg-neutral-900 bg-gray-100 fixed border-r top-0 left-0 min-h-screen w-80 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden z-50 flex flex-col`} >
                <div className="flex justify-between items-center py-5 px-3">
                    <Link to="/" className="md:hidden flex justify-center items-center gap-3">
                        <img src={LogoToolbox} alt={t("commons.logo-toolbox")} className="size-7" />
                        <h2 className="text-lg md:text-xl font-bold">JmJimenezToolbox</h2>
                    </Link>
                    <button title={t("alts.close-menu")} onClick={toggleMobileMenu} className="flex items-center cursor-pointer hover:scale-110">
                        <IoCloseOutline className="size-7" />
                    </button>
                </div>

                <aside className="flex-1 flex flex-col justify-between h-full col-span-4 xl:col-span-3 sticky top-36 border-r border-neutral-300 dark:border-neutral-800">
                    <AsideMenu />
                </aside>
            </div>

            <nav>
                <ul className="flex space-x-1">
                    <li>
                        <div className="relative" ref={dropdownLanguageRef}>
                            <button title={t("alts.select-language")} onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)} className="flex text-xl font-bold justify-center items-center gap-3 px-1 md:px-5 cursor-pointer hover:scale-110">
                                <img src={getFlagIcon(i18n.language)} alt={`flag of ${i18n.language}`} className="size-5" />
                            </button>
                            <div className={`z-10 ${languageDropdownOpen ? "block" : "hidden"} bg-neutral-100 dark:bg-neutral-900 divide-y divide-gray-100 rounded-b-lg shadow-xl w-full absolute right-0 mt-3`}>
                                <ul className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    <li className="border-t border-dark block hover:bg-clear-gray text-black dark:text-white">
                                        <button className="cursor-pointer flex w-full h-full items-center justify-center gap-2 md:px-4 py-3" onClick={() => handleLanguageSelection("es_ES")}>
                                            <img src={flagES} alt={t("countries.spain.flag-alt")} className="size-4 md:size-6" />
                                            <span className="hidden md:static">{t("countries.spain.abbreviation")}</span>
                                        </button>
                                    </li>
                                    <li className="border-t border-dark block hover:bg-clear-gray text-black dark:text-white">
                                        <button className="cursor-pointer flex w-full h-full items-center justify-center gap-2 md:px-4 py-3" onClick={() => handleLanguageSelection("en_GB")}>
                                            <img src={flagGB} alt={t("countries.united-kingdom.flag-alt")} className="size-4 md:size-6" />
                                            <span className="hidden md:static">{t("countries.united-kingdom.abbreviation")}</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="relative" ref={dropdownThemeRef}>
                            <button title={t("alts.select-theme")} onClick={() => setThemeDropdownOpen(!themeDropdownOpen)} className="flex text-xl font-bold justify-center items-center gap-3 px-1 md:px-5 cursor-pointer hover:scale-110">
                                {theme === "dark" ? <IoMoonOutline className="size-5" />
                                    : theme === "light" ? <IoSunnyOutline className="size-5" />
                                        : <IoTvOutline className="size-5" />}
                            </button>

                            <div className={`z-10 ${themeDropdownOpen ? "block" : "hidden"} bg-neutral-100 dark:bg-neutral-900 divide-y divide-gray-100 rounded-b-lg shadow-xl w-full absolute right-0 mt-3`}>
                                <ul className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    <li className="border-t border-dark block hover:bg-clear-gray text-black dark:text-white">
                                        <button title={t("alts.light-mode")} className="cursor-pointer flex w-full h-full items-center justify-center gap-2 md:px-4 py-3" onClick={() => handleThemeSelection("light")}>
                                            <IoSunnyOutline className="size-4 md:size-6" />
                                        </button>
                                    </li>
                                    <li className="border-t border-dark block hover:bg-clear-gray text-black dark:text-white">
                                        <button title={t("alts.dark-mode")} className="cursor-pointer flex w-full h-full items-center justify-center gap-2 md:px-4 py-3" onClick={() => handleThemeSelection("dark")}>
                                            <IoMoonOutline className="size-4 md:size-6" />
                                        </button>
                                    </li>
                                    <li className="border-t border-dark block hover:bg-clear-gray text-black dark:text-white">
                                        <button title={t("alts.system-mode")} className="cursor-pointer flex w-full h-full items-center justify-center gap-2 md:px-4 py-3" onClick={() => handleThemeSelection("system")}>
                                            <IoTvOutline className="size-4 md:size-6" />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
};