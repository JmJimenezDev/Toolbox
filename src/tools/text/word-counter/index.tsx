import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardSection } from '../../../components/CardSection';

export default function WordCounter() {
    const { t } = useTranslation();
      
    const [text, setText] = useState("");

    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const charCountWithSpaces = text.length;
    const charCountWithoutSpaces = text.replace(/\s/g, '').length;
    const paragraphCount = text.trim() ? text.split(/\n+/).filter(p => p.trim()).length : 0;

    return <CardSection title={t("plugins.word-counter.title")} description={t("plugins.word-counter.description")}>

        <div className='flex flex-wrap gap-4 justify-center'>
            {[
                { label: t("plugins.word-counter.label.words"), value: wordCount },
                { label: t("plugins.word-counter.label.sentences"), value: sentenceCount },
                { label: t("plugins.word-counter.label.characters-with-spaces"), value: charCountWithSpaces },
                { label: t("plugins.word-counter.label.characters-without-spaces"), value: charCountWithoutSpaces },
                { label: t("plugins.word-counter.label.paragraphs"), value: paragraphCount },
            ].map((item, index) => (
                <div key={index} className="flex items-center gap-5 px-3 py-1 border border-neutral-300 dark:border-neutral-700 rounded">
                    <span className="text-sm">{item.label}</span>
                    <span className="font-mono">{item.value}</span>
                </div>
            ))}
        </div>

        <div className="flex flex-col gap-2 mt-5">
            <div className="flex items-center justify-between">
                <label htmlFor="text" className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("commons.text")}
                </label>
                {text && <button onClick={() => setText("")} aria-label={t("commons.clear")} className="text-sm text-red-500 hover:underline">{t("commons.clear")}</button>}
            </div>
            <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("plugins.word-counter.label.text-placeholder")}
                className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded resize-none h-80 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
            />
        </div>
    </CardSection>;
}