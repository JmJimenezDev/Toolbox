import { useState } from "react";
import { t } from "i18next";
import { CardSection } from "../../../components/CardSection";

type Unit = "ms" | "s" | "min" | "h" | "d" | "w" | "mo" | "y" | "epoch" | "date";

export default function DateConverter() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [fromValue, setFromValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<Unit | "">("");
  const [toUnit, setToUnit] = useState<Unit | "">("");
  const [convertedValue, setConvertedValue] = useState<string | number>("");
  const [differenceResult, setDifferenceResult] = useState<string>("");

  const units: { label: string; value: Unit }[] = [
    { label: t("plugins.date-converter.unit.ms"), value: "ms" },
    { label: t("plugins.date-converter.unit.s"), value: "s" },
    { label: t("plugins.date-converter.unit.min"), value: "min" },
    { label: t("plugins.date-converter.unit.h"), value: "h" },
    { label: t("plugins.date-converter.unit.d"), value: "d" },
    { label: t("plugins.date-converter.unit.w"), value: "w" },
    { label: t("plugins.date-converter.unit.mo"), value: "mo" },
    { label: t("plugins.date-converter.unit.y"), value: "y" },
    { label: t("plugins.date-converter.unit.epoch"), value: "epoch" },
    { label: t("plugins.date-converter.unit.date"), value: "date" },
  ];

  const handleChange = (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
    };

  const handleUnitChange = (setter: React.Dispatch<React.SetStateAction<Unit | "">>) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value as Unit | "");
    };

  const formatDifference = (diffMs: number): string => {
    const absMs = Math.abs(diffMs);
    const years = Math.floor(absMs / (365 * 24 * 3600 * 1000));
    const months = Math.floor((absMs % (365 * 24 * 3600 * 1000)) / (30 * 24 * 3600 * 1000));
    const days = Math.floor((absMs % (30 * 24 * 3600 * 1000)) / (24 * 3600 * 1000));
    const hours = Math.floor((absMs % (24 * 3600 * 1000)) / (3600 * 1000));
    const minutes = Math.floor((absMs % (3600 * 1000)) / (60 * 1000));
    const seconds = Math.floor((absMs % (60 * 1000)) / 1000);

    return t("plugins.date-converter.result.format", {
      years, months, days, hours, minutes, seconds,
      defaultValue: `${years} ${t("plugins.date-converter.unit.y")}, ${months} ${t("plugins.date-converter.unit.mo")}, ${days} ${t("plugins.date-converter.unit.d")}, ${hours} ${t("plugins.date-converter.unit.h")}, ${minutes} ${t("plugins.date-converter.unit.min")}, ${seconds} ${t("plugins.date-converter.unit.s")}`
    });
  };

  const calculateDifference = () => {
    if (!fromDate || !toDate) {
      setDifferenceResult(t("plugins.date-converter.label.no-difference"));
      return;
    }
    const diffMs = new Date(toDate).getTime() - new Date(fromDate).getTime();
    setDifferenceResult(formatDifference(diffMs));
  };

  const convertValue = () => {
    if (!fromValue || !fromUnit || !toUnit) return;

    let numValue: number;
    if (fromUnit === "date") {
      numValue = new Date(fromValue).getTime();
    } else {
      numValue = parseFloat(fromValue);
      if (isNaN(numValue)) return;
    }

    let valueInMs: number;
    switch (fromUnit) {
      case "ms": valueInMs = numValue; break;
      case "s": valueInMs = numValue * 1000; break;
      case "min": valueInMs = numValue * 60 * 1000; break;
      case "h": valueInMs = numValue * 3600 * 1000; break;
      case "d": valueInMs = numValue * 24 * 3600 * 1000; break;
      case "w": valueInMs = numValue * 7 * 24 * 3600 * 1000; break;
      case "mo": valueInMs = numValue * 30 * 24 * 3600 * 1000; break;
      case "y": valueInMs = numValue * 365 * 24 * 3600 * 1000; break;
      case "epoch": valueInMs = numValue * 1000; break;
      case "date": valueInMs = numValue; break;
      default: valueInMs = numValue;
    }

    let result: string | number;
    switch (toUnit) {
      case "ms": result = valueInMs; break;
      case "s": result = valueInMs / 1000; break;
      case "min": result = valueInMs / (60 * 1000); break;
      case "h": result = valueInMs / (3600 * 1000); break;
      case "d": result = valueInMs / (24 * 3600 * 1000); break;
      case "w": result = valueInMs / (7 * 24 * 3600 * 1000); break;
      case "mo": result = valueInMs / (30 * 24 * 3600 * 1000); break;
      case "y": result = valueInMs / (365 * 24 * 3600 * 1000); break;
      case "epoch": result = Math.floor(valueInMs / 1000); break;
      case "date": result = new Date(valueInMs).toISOString().slice(0, 16); break;
      default: result = valueInMs;
    }

    if (typeof result === "number" && toUnit !== "date") {
      result = new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(result);
    }

    setConvertedValue(result);
  };

  return (
    <CardSection title={t("plugins.date-converter.title")} description={t("plugins.date-converter.description")}>
      <p className="font-semibold">{t("plugins.date-converter.label.date-difference")}</p>
      <div className="grid grid-cols-2 mt-2 gap-5">
        <div>
          <label htmlFor="from-date" className="text-sm text-neutral-600 dark:text-neutral-400">{t("plugins.date-converter.label.from")}</label>
          <input id="from-date" type="datetime-local" className="mt-2 w-full" value={fromDate} onChange={handleChange(setFromDate)} />
        </div>
        <div>
          <label htmlFor="to-date" className="text-sm text-neutral-600 dark:text-neutral-400">{t("plugins.date-converter.label.to")}</label>
          <input id="to-date" type="datetime-local" className="mt-2 w-full" value={toDate} onChange={handleChange(setToDate)} />
        </div>
      </div>
      <button onClick={calculateDifference} className="cursor-pointer w-full mt-5 py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800">
        {t("plugins.date-converter.label.calculate-difference")}
      </button>
      <div aria-live="polite" className="font-mono py-2 px-4 w-full min-h-10 mt-5 border-l-4 border-green-500 rounded bg-neutral-200 dark:bg-neutral-950">
        {differenceResult}
      </div>

      <p className="font-semibold mt-10">{t("plugins.date-converter.label.convert")}</p>
      <div className="grid grid-cols-2 mt-2 gap-5">
        <div>
          <label htmlFor="from-unit" className="text-sm text-neutral-600 dark:text-neutral-400">{t("plugins.date-converter.label.from-number")}</label>
          <select id="from-unit" className="mt-2 w-full py-2 px-3" value={fromUnit} onChange={handleUnitChange(setFromUnit)}>
            <option value="">{t("commons.select-etc")}</option>
            {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
          {fromUnit === "date" ? <input type="datetime-local" className="mt-2 w-full py-2 px-3 border border-neutral-300 dark:border-neutral-700 rounded" value={fromValue} onChange={handleChange(setFromValue)} />
            :
            <input type="number" className="mt-2 w-full py-2 px-3 border border-neutral-300 dark:border-neutral-700 rounded" value={fromValue} onChange={handleChange(setFromValue)} />
          }
        </div>
        <div>
          <label htmlFor="to-unit" className="text-sm text-neutral-600 dark:text-neutral-400">{t("plugins.date-converter.label.to-number")}</label>
          <select id="to-unit" className="mt-2 w-full py-2 px-3" value={toUnit} onChange={handleUnitChange(setToUnit)}>
            <option value="">{t("commons.select-etc")}</option>
            {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
          <div aria-live="polite" className="overflow-x-auto font-mono py-2 px-4 w-full min-h-10 mt-2 border-l-4 border-green-500 rounded bg-neutral-200 dark:bg-neutral-950">
            {convertedValue}
          </div>
        </div>
      </div>
      <button onClick={convertValue} className="cursor-pointer w-full mt-5 py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800">
        {t("plugins.date-converter.label.convert")}
      </button>
    </CardSection>
  );
}