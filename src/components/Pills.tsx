import clsx from "clsx";

type PillButtonProps = {
    onClick: () => void;
    type?: "red" | "green" | "yellow";
    children: React.ReactNode;
};

export const PillButton = ({ onClick, type = "red", children }: PillButtonProps) => {
    const buttonClasses = clsx(
        "cursor-pointer px-3 py-1 rounded-2xl text-xs",
        {
            "bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-500": type === "red",
            "bg-green-200 text-green-700 dark:bg-green-950 dark:text-green-500": type === "green",
            "bg-yellow-200 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-500": type === "yellow",
        }
    );

    return (
        <button onClick={onClick} className={buttonClasses}>
            {children}
        </button>
    );
};