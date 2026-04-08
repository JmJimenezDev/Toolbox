import { t } from "i18next";
import { CardSection } from "../../../components/CardSection";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkDownViewer() {
    const [text, setText] = useState("");

    return <CardSection title={t("plugins.markdown-viewer.title")} description={t("plugins.markdown-viewer.description")}
        className="max-w-4xl">
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="text" className="text-sm text-neutral-600 dark:text-neutral-400">
                        Markdown
                    </label>
                    {text && <button onClick={() => setText("")} className="text-sm text-red-500 hover:underline">{t("commons.clear")}</button>}
                </div>
                <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t("plugins.markdown-viewer.label.input-placeholder")}
                    className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded resize-none h-110 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                />
            </div>

            <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {t("plugins.markdown-viewer.label.preview")}
                    </p>
                </div>
                <div className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded resize-none h-110 overflow-y-auto">
                    <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {text}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    </CardSection>
}