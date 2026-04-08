import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoAddOutline, IoStar, IoStarOutline } from "react-icons/io5";
import { CardSection } from "../../../components/CardSection";
import { PillButton } from "../../../components/Pills";
import { timeZones } from "./timeZones";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export default function TimeZoneConverter() {
    const { i18n, t } = useTranslation();
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [showedTimeZones, setShowedTimeZones] = useState<{ countryKey: string; zone: string }[]>([]);
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>("");
    const [favoriteTimeZones, setFavoriteTimeZones] = useState<string[]>([]);

    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        const stored = localStorage.getItem("favoriteTimeZones");
        if (stored) {
            setFavoriteTimeZones(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (favoriteTimeZones.length === 0) return;

        const favZones = timeZones.filter((tz) =>
            favoriteTimeZones.includes(tz.zone)
        );

        setShowedTimeZones((prev) => {
            const existing = prev.map((t) => t.zone);
            const newOnes = favZones.filter((tz) => !existing.includes(tz.zone));
            return [...newOnes, ...prev];
        });
    }, [favoriteTimeZones]);

    useEffect(() => {
        const onLanguageChanged = (lng: string) => setLanguage(lng);
        i18n.on("languageChanged", onLanguageChanged);
        return () => i18n.off("languageChanged", onLanguageChanged);
    }, [i18n]);

    useEffect(() => {
        dayjs.locale(language.split("_")[0]);
    }, [language]);

    const setCurrentTime = () => {
        const now = dayjs();
        setHours(now.format("HH"));
        setMinutes(now.format("mm"));
    };

    useEffect(() => {
        setCurrentTime();
    }, []);

    const toggleFavorite = (zone: string) => {
        setFavoriteTimeZones((prev) => {
            let updated;

            if (prev.includes(zone))
                updated = prev.filter((z) => z !== zone);
            else
                updated = [...prev, zone];

            localStorage.setItem("favoriteTimeZones", JSON.stringify(updated));
            return updated;
        });
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 2);
        if (Number(value) > 23) value = "23";
        setHours(value);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "").slice(0, 2);
        if (Number(value) > 59) value = "59";
        setMinutes(value);
    };

    const formatDisplay = (value: string) => value.padStart(2, "0");

    const getLocalTime = () => {
        const today = dayjs().format("YYYY-MM-DD");
        return dayjs.tz(
            `${today} ${formatDisplay(hours)}:${formatDisplay(minutes)}`,
            "YYYY-MM-DD HH:mm",
            localTimeZone
        ).locale(language.split("_")[0]);
    };

    const handleAddTimeZone = () => {
        const tzToAdd = timeZones.find((tz) => tz.zone === selectedTimeZone);
        if (tzToAdd && !showedTimeZones.some((tz) => tz.zone === tzToAdd.zone)) {
            setShowedTimeZones((prev) => [...prev, tzToAdd]);
        }
    };

    const removeTimeZone = (zone: string) => {
        setShowedTimeZones((prev) => prev.filter((tz) => tz.zone !== zone));
    }

    return (
        <CardSection
            title={t("plugins.time-zone-converter.title")}
            description={t("plugins.time-zone-converter.description")}
        >
            <div className="flex flex-col items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("plugins.time-zone-converter.label.your-time-zone")} -{" "}
                    <span className="font-medium">{localTimeZone}</span>
                </span>

                <div className="mt-2 flex items-center gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={formatDisplay(hours)}
                        onChange={handleHoursChange}
                        className="bg-neutral-200 dark:bg-neutral-950 rounded font-mono font-bold p-4 text-5xl w-24 text-center"
                    />
                    <span className="text-4xl font-mono font-bold">:</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={formatDisplay(minutes)}
                        onChange={handleMinutesChange}
                        className="bg-neutral-200 dark:bg-neutral-950 rounded font-mono font-bold p-4 text-5xl w-24 text-center"
                    />
                </div>

                <button
                    onClick={setCurrentTime}
                    className="cursor-pointer mt-5 py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800"
                >
                    {t("plugins.time-zone-converter.label.set-current-time")}
                </button>
            </div>

            {showedTimeZones.length > 0 && <div className="space-y-2 mt-5">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                    {t("plugins.time-zone-converter.label.results")}
                </p>
                {[...showedTimeZones]
                    .sort((a, b) => {
                        const aFav = favoriteTimeZones.includes(a.zone);
                        const bFav = favoriteTimeZones.includes(b.zone);

                        if (aFav === bFav) return 0;
                        return aFav ? -1 : 1;
                    })
                    .map((tz) => {
                        const time = getLocalTime().tz(tz.zone);
                        const offset = time.format("Z");
                        return (
                            <div
                                key={tz.zone}
                                className="border-l-4 border-green-500 rounded py-2 px-2  bg-neutral-200 dark:bg-neutral-950"
                            >
                                <div className="flex justify-between mb-1">
                                    <PillButton onClick={() => toggleFavorite(tz.zone)} type="yellow">
                                        {favoriteTimeZones.includes(tz.zone) ? <IoStar size={16} /> : <IoStarOutline size={16} />}
                                    </PillButton>
                                    <PillButton onClick={() => removeTimeZone(tz.zone)}>
                                        {t("commons.remove")}
                                    </PillButton>
                                </div>
                                <div className="px-3 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-3 sm:gap-0">
                                    <div>
                                        <p className="font-bold text-lg">{t(`plugins.time-zone-converter.time-zones.${tz.countryKey}.zone`)}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{t(`plugins.time-zone-converter.time-zones.${tz.countryKey}.name`)}</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {time.format("LL")} - {time.format("dddd").toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <span className="font-mono text-4xl">{time.format("HH:mm")}</span>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            <span className="mr-1">UTC</span>
                                            {offset}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
            </div>}

            {(showedTimeZones.length < timeZones.length) && <div className="mt-5 text-sm text-neutral-600 dark:text-neutral-400">
                <p>{t("plugins.time-zone-converter.label.show-time-zone")}</p>
                <div className="flex items-center gap-1 mt-2">
                    <select
                        id="showed-time-zones"
                        className="w-full py-2 px-3"
                        onChange={(e) => setSelectedTimeZone(e.target.value)}
                        value={selectedTimeZone}
                    >
                        <option value="">
                            {t("commons.select-etc")}
                        </option>
                        {timeZones
                            .filter((tz) => !showedTimeZones.some((stz) => stz.zone === tz.zone))
                            .map((tz) => (
                                <option key={tz.zone} value={tz.zone}>
                                    {t(`plugins.time-zone-converter.time-zones.${tz.countryKey}.name`)} - {t(`plugins.time-zone-converter.time-zones.${tz.countryKey}.zone`)}
                                </option>
                            ))}
                    </select>
                    <button
                        onClick={handleAddTimeZone}
                        className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400"
                    >
                        <IoAddOutline className="text-lg" />
                    </button>
                </div>
            </div>}
        </CardSection>
    );
}