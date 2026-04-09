import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import { CardSection } from "../../../components/CardSection";

export default function Base64Encoder() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [isCopied, setIsCopied] = useState(false);

  const encodeBase64 = (str: string) => {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  };

  const decodeBase64 = (base64: string) => {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value) {
      try {
        if (mode === "encode") {
          setOutput(encodeBase64(value));
        } else {
          setOutput(decodeBase64(value));
        }
      } catch {
        setOutput("");
      }
    } else {
      setOutput("");
    }
  };

  const toggleMode = (newMode: "encode" | "decode") => {
    setMode(newMode);
    setInput(output);
    setOutput("");
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return <CardSection title={t("plugins.base64.title")} description={t("plugins.base64.description")} className="max-w-4xl">
    <div className="flex gap-2 mb-5">
      <button
        onClick={() => toggleMode("encode")}
        aria-label={t("plugins.base64.actions.encode")}
        className={`cursor-pointer flex-1 py-2 px-4 rounded transition-colors ${mode === "encode"
          ? "bg-neutral-900 text-neutral-200 dark:bg-neutral-100 dark:text-neutral-800"
          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          }`}
      >
        {t("plugins.base64.actions.encode")}
      </button>
      <button
        onClick={() => toggleMode("decode")}
        aria-label={t("plugins.base64.actions.decode")}
        className={`cursor-pointer flex-1 py-2 px-4 rounded transition-colors ${mode === "decode"
          ? "bg-neutral-900 text-neutral-200 dark:bg-neutral-100 dark:text-neutral-800"
          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          }`}
      >
        {t("plugins.base64.actions.decode")}
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="base64-input" className="text-sm text-neutral-600 dark:text-neutral-400">
            {t("plugins.base64.label.input")}
          </label>
          {input && (
            <button onClick={() => { setInput(""); setOutput(""); }} aria-label={t("commons.clear")} className="text-sm text-red-500 hover:underline">
              {t("commons.clear")}
            </button>
          )}
        </div>
        <textarea
          id="base64-input"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={mode === "encode" ? t("plugins.base64.placeholder.input-encode") : t("plugins.base64.placeholder.input-decode")}
          className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded resize-none h-80 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition font-mono text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {t("plugins.base64.label.output")}
          </span>
          {output && (
            <button onClick={copyOutput} aria-label={t("alts.copy")} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
              {isCopied ? <IoCheckmarkOutline className="text-lg" /> : <IoCopyOutline className="text-lg" />}
            </button>
          )}
        </div>
        <textarea
          readOnly
          value={output}
          aria-live="polite"
          placeholder={t("plugins.base64.placeholder.output")}
          className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded resize-none h-80 font-mono text-sm"
        />
      </div>
    </div>
  </CardSection>
}