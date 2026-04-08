import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import { CardSection } from "../../../components/CardSection";
import i18n from "../../../utils/i18n";
import { jsonSyntaxHighlight } from "../../../utils/utils";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const decoded = atob(base64);
    try {
        return decodeURIComponent(decoded.split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    } catch {
        return decoded;
    }
};

export default function JwtDecoder() {
    const [jwt, setJwt] = useState("");
    const [error, setError] = useState("");
    const [decodedJwt, setDecodedJwt] = useState<{
        header: Record<string, unknown> | null;
        payload: Record<string, unknown> | null;
        signature: string;
    }>({ header: null, payload: null, signature: "" });
    const [copied, setCopied] = useState<{ header: boolean; payload: boolean }>({
        header: false,
        payload: false
    });
    const [language, setLanguage] = useState(i18n.language);

    const decodeJwt = () => {
        setError("");
        if (!jwt) return;

        const parts = jwt.split(".");
        if (parts.length !== 3) {
            setError(t("plugins.jwt-decoder.error.invalid_token"));
            setDecodedJwt({ header: null, payload: null, signature: "" });
            return;
        }

        const [headerPart, payloadPart, signaturePart] = parts;

        try {
            const header = JSON.parse(base64UrlDecode(headerPart));
            const payload = JSON.parse(base64UrlDecode(payloadPart));
            setDecodedJwt({ header, payload, signature: signaturePart });
        } catch {
            setError(t("plugins.jwt-decoder.error.decode_failed"));
            setDecodedJwt({ header: null, payload: null, signature: "" });
        }
    };

    const formatTimestamp = (ts: number) => {
        return dayjs.unix(ts).tz(dayjs.tz.guess()).locale(language.split("_")[0]).format("LLLL");
    };

    useEffect(() => {
        const onLanguageChanged = (lng: string) => setLanguage(lng);
        i18n.on("languageChanged", onLanguageChanged);
        return () => i18n.off("languageChanged", onLanguageChanged);
    }, []);

    useEffect(() => {
        dayjs.locale(language.split("_")[0]);
    }, [language]);

    const handleCopy = (type: "header" | "payload") => {
        const data = type === "header" ? decodedJwt.header : decodedJwt.payload;
        if (!data) return;
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1500);
    };

    return (
        <CardSection title={t("plugins.jwt-decoder.title")} description={t("plugins.jwt-decoder.description")}>
            <label htmlFor="jwt" className="text-sm text-neutral-600 dark:text-neutral-400">
                {t("plugins.jwt-decoder.label.jwt")}
            </label>
            <input id="jwt" type="text" value={jwt} onChange={(e) => setJwt(e.target.value)}
                className="w-full mt-2 p-2 font-mono bg-neutral-200 dark:bg-neutral-800 rounded"
            />

            <button onClick={decodeJwt}
                className="cursor-pointer w-full mt-5 py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800"
            >
                {t("plugins.jwt-decoder.label.decode")}
            </button>

            {error && <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>}

            {decodedJwt.header && <>
                <p className="mt-5 text-sm text-neutral-600 dark:text-neutral-400">
                    {t("plugins.jwt-decoder.label.header")}
                </p>
                <div className="relative">
                    <button aria-label={t("alts.copy")} onClick={() => handleCopy("header")} title={t("alts.copy")}
                        className="absolute right-0 m-2 border border-neutral-300 dark:border-neutral-700 cursor-pointer p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400"
                    >
                        {copied.header ? <IoCheckmarkOutline className="text-lg" /> : <IoCopyOutline className="text-lg" />}
                    </button>
                    <pre dangerouslySetInnerHTML={{ __html: jsonSyntaxHighlight(decodedJwt.header) }}
                        className="w-full mt-2 p-4 font-mono bg-neutral-200 dark:bg-neutral-800 rounded overflow-x-auto"
                    />
                </div>
            </>}

            {decodedJwt.payload && <>
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                    {t("plugins.jwt-decoder.label.payload")}
                </p>
                <div className="relative">
                    <button aria-label={t("alts.copy")} onClick={() => handleCopy("payload")} title={t("alts.copy")}
                        className="absolute right-0 m-2 border border-neutral-300 dark:border-neutral-700 cursor-pointer p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400"
                    >
                        {copied.payload ? <IoCheckmarkOutline className="text-lg" /> : <IoCopyOutline className="text-lg" />}
                    </button>
                    <pre dangerouslySetInnerHTML={{ __html: jsonSyntaxHighlight(decodedJwt.payload) }}
                        className="w-full mt-2 p-4 font-mono bg-neutral-200 dark:bg-neutral-800 rounded overflow-x-auto"
                    />
                </div>

                {decodedJwt.payload.exp && (
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                        {t("plugins.jwt-decoder.label.expires_at")}: {formatTimestamp(decodedJwt.payload.exp as number)}
                    </p>
                )}
            </>}

            {decodedJwt.signature && <>
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                    {t("plugins.jwt-decoder.label.signature")}
                </p>
                <pre className="w-full mt-2 p-4 font-mono bg-neutral-200 dark:bg-neutral-800 rounded overflow-x-auto">
                    {decodedJwt.signature}
                </pre>
            </>}
        </CardSection>
    );
}