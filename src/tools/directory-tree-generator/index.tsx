import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CardSection } from "../../components/CardSection";

type TreeNode = {
    value: string;
    children: TreeNode[];
};

export default function DirectoryTreeGenerator() {
    const { t } = useTranslation();
      
    const [text, setText] = useState<string>("");
    const [asciiTree, setAsciiTree] = useState<string>("");

    const parseIndentedText = (input: string): TreeNode[] => {
        const lines = input
            .split(/\r?\n/)
            .map((line) => line.replace(/\s+$/g, ""))
            .filter((line) => line.trim() !== "");

        if (lines.length === 0) return [];

        const indents = lines
            .map((line) => line.match(/^ */)?.[0].length ?? 0)
            .filter((spaces) => spaces > 0);
        const minIndent = indents.length > 0 ? Math.min(...indents) : 2;

        const tree: TreeNode[] = [];
        const stack: TreeNode[] = [];

        lines.forEach((line) => {
            const leadingSpaces = line.match(/^ */)?.[0].length ?? 0;
            const level = Math.floor(leadingSpaces / minIndent);

            const value = line.trim().replace(/^[-*+] ?/, "");
            const node: TreeNode = { value, children: [] };

            if (level === 0) {
                tree.push(node);
                stack.length = 0;
                stack.push(node);
            } else {
                while (stack.length > level) stack.pop();
                const parent = stack[stack.length - 1];
                parent.children.push(node);
                stack.push(node);
            }
        });

        return tree;
    };

    const generateAsciiTree = (
        nodes: TreeNode[],
        prefix = "",
        level = 0
    ): string => {
        let result = "";

        nodes.forEach((node, index) => {
            const isLast = index === nodes.length - 1;

            // Solo dibujar símbolo si no es nivel 0
            const connector = level === 0 ? "" : isLast ? "└── " : "├── ";

            result += `${prefix}${connector}${node.value}\n`;

            if (node.children.length > 0) {
                const childPrefix = prefix + (level === 0 ? "" : isLast ? "    " : "│   ");
                result += generateAsciiTree(node.children, childPrefix, level + 1);
            }
        });

        return result;
    };

    // ---------------- Handle Generate ----------------
    const handleGenerate = () => {
        try {
            const tree = parseIndentedText(text);
            setAsciiTree(generateAsciiTree(tree));
        } catch (e) {
            console.error("Error parsing text:", e);
        }
    };

    return (
        <CardSection
            title={t("plugins.directory-tree-generator.title")}
            description={t("plugins.directory-tree-generator.description")}
            className="max-w-4xl"
        >
            <div className="grid grid-cols-12 gap-5">
                {/* Input Section */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="text"
                            className="text-sm text-neutral-600 dark:text-neutral-400"
                        >
                            {t("plugins.directory-tree-generator.label.input")}
                        </label>
                        {text && (
                            <button
                                onClick={() => setText("")}
                                aria-label={t("commons.clear")}
                                className="text-sm text-red-500 hover:underline"
                            >
                                {t("commons.clear")}
                            </button>
                        )}
                    </div>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t(
                            "plugins.directory-tree-generator.placeholder.input-text"
                        )}
                        className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded resize-none h-110 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
                    />
                    <button
                        onClick={handleGenerate}
                        aria-label={t("plugins.directory-tree-generator.button.generate")}
                        className="cursor-pointer w-full mt-2 py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800"
                    >
                        {t("plugins.directory-tree-generator.button.generate")}
                    </button>
                </div>

                {/* Output Section */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {t("plugins.directory-tree-generator.label.output")}
                        </p>
                    </div>
                    <div className="w-full p-3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded resize-none h-110 overflow-y-auto">
                        <pre className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                            {asciiTree}
                        </pre>
                    </div>
                </div>
            </div>
        </CardSection>
    );
}