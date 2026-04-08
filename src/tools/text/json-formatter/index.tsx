import Editor from "@monaco-editor/react";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCheckmarkOutline, IoCopyOutline, IoDownloadOutline } from "react-icons/io5";
import { CardSection } from "../../../components/CardSection";
import { jsonSyntaxHighlight } from "../../../utils/utils";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function JsonFormatter() {
    const { t } = useTranslation();
      
    const [text, setText] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<{ lines: number; chars: number; size: string } | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [theme, setTheme] = useState(
        localStorage.getItem("selectedTheme") === "dark" ? "vs-dark" : "vs-light"
    );
    const editorRef = useRef<unknown>(null);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const isDark = localStorage.getItem("selectedTheme") === "dark";
            setTheme(isDark ? "vs-dark" : "vs-light");
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();
    }, []);

    const translateJsonError = (err: any) => {
        const msg = err.message;

        if (msg.includes("Unexpected token"))
            return t("plugins.json-formatter.errors.unexpected-token");

        if (msg.includes("Unexpected end"))
            return t("plugins.json-formatter.errors.unexpected-end");

        return t("plugins.json-formatter.errors.invalid-json");
    };

    const computeStats = (json: any) => {
        const size = new Blob([json]).size;

        setStats({
            lines: json.split("\n").length,
            chars: json.length,
            size: (size / 1024).toFixed(2),
        });
    };

    const formatJson = () => {
        try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError(null);
            computeStats(formatted);
        } catch (err) {
            setError(translateJsonError(err));
            setOutput("");
            setStats(null);
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(text);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError(null);
            computeStats(minified);
        } catch (err) {
            setError(translateJsonError(err));
            setOutput("");
            setStats(null);
        }
    };

    const validateJson = () => {
        try {
            JSON.parse(text);
            setError(null);
            setOutput(t("plugins.json-formatter.valid"));
            setStats(null);
        } catch (err) {
            setError(translateJsonError(err));
            setOutput("");
        }
    };

    const debouncedValidate = useRef(
        debounce((value) => {
            if (!value) return;

            try {
                JSON.parse(value);
                setError(null);
            } catch (err) {
                setError(translateJsonError(err));
            }
        }, 500)
    ).current;

    useEffect(() => {
        debouncedValidate(text);
    });

    const copyOutput = async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 500);
    };

    const downloadJson = () => {
        if (!output) return;

        const blob = new Blob([output], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted.json";
        a.click();

        URL.revokeObjectURL(url);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const fileSize = file.size;
        if (fileSize > MAX_SIZE_BYTES) {
            setError(t("plugins.json-formatter.errors.file-too-large"));
            return;
        }

        const fileText = await file.text();
        const textSize = new Blob([fileText]).size;
        if (textSize > MAX_SIZE_BYTES) {
            setError(t("plugins.json-formatter.errors.file-too-large"));
            return;
        }
        setText(fileText);
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const pasted = e.clipboardData.getData("text");
        if (!pasted) return;

        const pastedSize = new Blob([pasted]).size;
        if (pastedSize > MAX_SIZE_BYTES) {
            setError(t("plugins.json-formatter.errors.file-too-large"));
            return;
        }

        try {
            JSON.parse(pasted);
            setText(pasted);
        } catch {
            setText(pasted);
        }
    };

    return (
        <CardSection title={t("plugins.json-formatter.title")} description={t("plugins.json-formatter.description")} className="max-w-7xl">
            <div className="grid grid-cols-12 gap-5" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onPaste={handlePaste}>
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            JSON - {t("plugins.json-formatter.label.input-placeholder")}
                        </span>

                        {text && <button aria-label={t("commons.clear")} className="text-sm text-red-500 hover:underline"
                            onClick={() => {
                                setText("");
                                setOutput("");
                                setError(null);
                                setStats(null);
                            }}>
                            {t("commons.clear")}
                        </button>}
                    </div>

                    <Editor height="420px" language="json" value={text} theme={theme}
                        onMount={(editor) => (editorRef.current = editor)} onChange={(value) => setText(value || "")}
                        options={{
                            minimap: { enabled: false },
                            wordWrap: "on",
                            fontSize: 14,
                        }}
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <button aria-label={t("plugins.json-formatter.actions.format")} onClick={formatJson} className="flex-1 cursor-pointer py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800">
                            {t("plugins.json-formatter.actions.format")}
                        </button>

                        <button aria-label={t("plugins.json-formatter.actions.minify")} onClick={minifyJson} className="flex-1 cursor-pointer py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800">
                            {t("plugins.json-formatter.actions.minify")}
                        </button>

                        <button aria-label={t("plugins.json-formatter.actions.validate")} onClick={validateJson} className="flex-1 cursor-pointer py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800">
                            {t("plugins.json-formatter.actions.validate")}
                        </button>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {t("plugins.json-formatter.label.preview")}
                    </p>
                    <div className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded h-105 overflow-y-auto">
                        {error ? <p className="text-red-500 text-sm">{error}</p>
                            : <pre dangerouslySetInnerHTML={{ __html: jsonSyntaxHighlight(output) }}
                                className="text-sm whitespace-pre-wrap wrap-break-words" />}
                    </div>
                    <div className="flex justify-between">
                        <div className="text-xs text-neutral-500 flex gap-4">
                            {stats && <>
                                <span>{t("plugins.json-formatter.stats.lines")}: {stats.lines}</span>
                                <span>{t("plugins.json-formatter.stats.characters")}: {stats.chars}</span>
                                <span>{t("plugins.json-formatter.stats.size")}: {stats.size} KB</span>
                            </>}
                        </div>

                        {output && !error && (
                            <div className="flex gap-3">
                                <button aria-label={t("commons.download")} onClick={downloadJson} disabled={!text}
                                    className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800 disabled:opacity-50"
                                >
                                    <IoDownloadOutline aria-hidden="true" className="text-lg" /> {t("commons.download")}
                                </button>
                                <button onClick={copyOutput} aria-label={t("alts.copy")}
                                    className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400"
                                    title={t("alts.copy")}>
                                    {isCopied ? <IoCheckmarkOutline className="text-lg" /> : <IoCopyOutline className="text-lg" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CardSection>
    );
}