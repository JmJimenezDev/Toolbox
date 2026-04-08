import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoDownloadOutline } from "react-icons/io5";
import { CardSection } from "../../components/CardSection";

export default function QrGenerator() {
    const { t } = useTranslation();
      
    const [type, setType] = useState("url");
    const [text, setText] = useState("");
    const [logo, setLogo] = useState<string | null>(null);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [format, setFormat] = useState("svg");

    const qrRef = useRef<HTMLDivElement>(null);

    function buildQRValue() {
        switch (type) {
            case "wifi":
                return `WIFI:T:WPA;S:${text};P:password;;`;
            case "email":
                return `mailto:${text}`;
            case "phone":
                return `tel:${text}`;
            default:
                return text;
        }
    }

    const downloadQR = () => {
        const svg = qrRef.current?.querySelector("svg");
        if (!svg) return;

        if (format === "svg") {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);

            const blob = new Blob([svgString], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "qr-code.svg";
            link.click();

            URL.revokeObjectURL(url);
        }

        if (format === "png") {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const img = new Image();
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);

            const blob = new Blob([svgString], { type: "image/svg+xml" });
            const url = URL.createObjectURL(blob);

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                ctx?.drawImage(img, 0, 0);

                const png = canvas.toDataURL("image/png");

                const link = document.createElement("a");
                link.href = png;
                link.download = "qr-code.png";
                link.click();

                URL.revokeObjectURL(url);
            };

            img.src = url;
        }
    };

    function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result as string);
        reader.readAsDataURL(file);
    }

    const value = buildQRValue();

    return (
        <CardSection title={t("plugins.qr-generator.title")} description={t("plugins.qr-generator.description")}>
            <label htmlFor="qr-type" className="text-sm text-neutral-600 dark:text-neutral-400">{t("commons.type")}</label>
            <select id="qr-type" value={type} onChange={(e) => setType(e.target.value)} className="mt-2 w-full p-2 bg-neutral-200 dark:bg-neutral-800 rounded">
                <option value="url">URL</option>
                <option value="wifi">WiFi</option>
                <option value="email">{t("commons.email")}</option>
                <option value="phone">{t("commons.phone")}</option>
            </select>

            <label htmlFor="qr-text" className="sr-only">
                {t("plugins.qr-generator.label.content")}
            </label>
            <input id="qr-text" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://jmjimenez.dev"
                className="mt-3 w-full p-2 text-lg font-mono bg-neutral-200 dark:bg-neutral-800 rounded"
            />

            <div className="mt-5">
                <legend className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("plugins.qr-generator.label.colors")}
                </legend>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800">
                        <input 
                            type="color" 
                            id="qr-fg-color"
                            value={fgColor} 
                            onChange={(e) => setFgColor(e.target.value)}
                            className="size-10 cursor-pointer border-none bg-transparent"
                            aria-label={t("plugins.qr-generator.label.foreground-color")}
                        />
                        <div>
                            <p className="text-xs text-neutral-500">{t("plugins.qr-generator.label.foreground-color")}</p>
                            <p className="font-mono text-sm">{fgColor}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-200 dark:bg-neutral-800">
                        <input 
                            type="color" 
                            id="qr-bg-color"
                            value={bgColor} 
                            onChange={(e) => setBgColor(e.target.value)}
                            className="size-10 cursor-pointer border-none bg-transparent"
                            aria-label={t("plugins.qr-generator.label.background-color")}
                        />
                        <div>
                            <p className="text-xs text-neutral-500">{t("plugins.qr-generator.label.background-color")}</p>
                            <p className="font-mono text-sm">{bgColor}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-3">
                    {[
                        ["#000000", "#ffffff"],
                        ["#1f2937", "#ffffff"],
                        ["#0f172a", "#f8fafc"],
                        ["#1e40af", "#ffffff"],
                        ["#065f46", "#ecfdf5"]
                    ].map(([fg, bg], i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Preset ${fg} / ${bg}`}
                            onClick={() => {
                                setFgColor(fg);
                                setBgColor(bg);
                            }}
                            className="cursor-pointer size-7 rounded border border-neutral-300 dark:border-neutral-700 overflow-hidden"
                        >
                            <div className="w-full h-1/2" style={{ background: fg }} />
                            <div className="w-full h-1/2" style={{ background: bg }} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("plugins.qr-generator.label.logo")}
                </p>
                <div className="mt-2 flex items-center gap-4">
                    <label htmlFor="qr-logo" className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                        {t("commons.select")}
                        <input id="qr-logo" type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                    </label>
                    {logo && <div className="flex items-center gap-2">
                        <img src={logo} alt="logo preview" className="size-10 rounded border border-neutral-300 dark:border-neutral-700" />
                        <button onClick={() => setLogo(null)} aria-label={t("commons.remove")} className="ml-3 text-sm text-red-500 hover:underline">{t("commons.remove")}</button>
                    </div>}
                </div>
            </div>

            <hr className="my-5 border-t border-neutral-300 dark:border-neutral-700" />
            <div ref={qrRef} aria-live="polite" aria-label={text ? "QR code preview" : "QR code preview empty"}
                className={clsx("relative mt-5 mx-auto size-64.5 flex items-center justify-center",
                    !text && "border border-neutral-300 dark:border-neutral-700")}
            >
                {text && <>
                    <QRCodeSVG value={value} size={256} fgColor={fgColor} bgColor={bgColor} level="H"
                        imageSettings={logo ? { src: logo, width: 60, height: 60, excavate: true } : undefined}
                    />
                    {logo && <img src={logo} alt="logo" className="absolute w-16 h-16 rounded" />}
                </>}
            </div>

            <div className="flex items-center justify-center gap-1 mt-5">
                <button aria-label={t("commons.download")} onClick={downloadQR} disabled={!text}
                    className="flex items-center gap-2 cursor-pointer py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800 disabled:opacity-50"
                >
                    <IoDownloadOutline aria-hidden="true" className="text-lg" /> {t("commons.download")}
                </button>

                <label htmlFor="qr-format" className="sr-only hidden">
                    {t("plugins.qr-generator.label.format")}
                </label>
                <select id="qr-format" value={format} onChange={(e) => setFormat(e.target.value)} className="p-2.5 bg-neutral-200 dark:bg-neutral-800 rounded">
                    <option value="svg">SVG</option>
                    <option value="png">PNG</option>
                </select>
            </div>
        </CardSection>
    );
}