import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCheckmarkOutline, IoCopyOutline } from "react-icons/io5";
import { CardSection } from "../../../components/CardSection";

type ColorFormat = "hex" | "rgb" | "hsl";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const normalizeHex = (hex: string): string | null => {
  hex = hex.replace("#", "").trim();

  if (hex.length === 3)
    hex = hex.split("").map((c) => c + c).join("");

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;

  return `#${hex.toLowerCase()}`;
};

const hexToRgb = (hex: string): RGB | null => {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!result) return null;

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

const rgbToHex = ({ r, g, b }: RGB): string =>
  "#" +
  [r, g, b]
    .map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0"))
    .join("");

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);

  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const parseRgb = (str: string): RGB | null => {
  const match = str.match(/rgba?\s*\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (!match) return null;

  return {
    r: clamp(Number(match[1]), 0, 255),
    g: clamp(Number(match[2]), 0, 255),
    b: clamp(Number(match[3]), 0, 255),
  };
};

const parseHsl = (str: string): HSL | null => {
  const match = str.match(/hsla?\s*\(\s*(\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?/i);
  if (!match) return null;

  return {
    h: clamp(Number(match[1]), 0, 360),
    s: clamp(Number(match[2]), 0, 100),
    l: clamp(Number(match[3]), 0, 100),
  };
};

const formatRgb = ({ r, g, b }: RGB) => `rgb(${r}, ${g}, ${b})`;
const formatHsl = ({ h, s, l }: HSL) => `hsl(${h}, ${s}%, ${l}%)`;

export default function ColorConverter() {
  const { t } = useTranslation();

  const [rgb, setRgb] = useState<RGB>({ r: 56, g: 201, b: 80 });

  const [hexInput, setHexInput] = useState("#38C950");
  const [rgbInput, setRgbInput] = useState("rgb(56, 201, 80)");
  const [hslInput, setHslInput] = useState("hsl(130, 57%, 50%)");

  const [copiedFormat, setCopiedFormat] = useState<ColorFormat | null>(null);

  const hex = rgbToHex(rgb);

  const handleHexChange = (value: string) => {
    setHexInput(value);

    const parsed = hexToRgb(value);
    if (!parsed) return;

    const newRgb = parsed;
    const newHsl = rgbToHsl(newRgb);

    setRgb(newRgb);
    setRgbInput(formatRgb(newRgb));
    setHslInput(formatHsl(newHsl));
  };

  const handleRgbChange = (value: string) => {
    setRgbInput(value);

    const parsed = parseRgb(value);
    if (!parsed) return;

    const newRgb = parsed;
    const newHex = rgbToHex(newRgb);
    const newHsl = rgbToHsl(newRgb);

    setRgb(newRgb);
    setHexInput(newHex);
    setHslInput(formatHsl(newHsl));
  };

  const handleHslChange = (value: string) => {
    setHslInput(value);

    const parsed = parseHsl(value);
    if (!parsed) return;

    const newRgb = hslToRgb(parsed);
    const newHex = rgbToHex(newRgb);

    setRgb(newRgb);
    setHexInput(newHex);
    setRgbInput(formatRgb(newRgb));
  };

  const copyToClipboard = async (format: ColorFormat, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // --------------------
  // UI
  // --------------------

  const colorFormats = [
    { format: "hex" as ColorFormat, label: "HEX", value: hexInput, onChange: handleHexChange },
    { format: "rgb" as ColorFormat, label: "RGB", value: rgbInput, onChange: handleRgbChange },
    { format: "hsl" as ColorFormat, label: "HSL", value: hslInput, onChange: handleHslChange },
  ];

  return (
    <CardSection
      title={t("plugins.color-converter.title")}
      description={t("plugins.color-converter.description")}
      className="max-w-4xl"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4">
            <label className="text-sm text-neutral-600 dark:text-neutral-400">
              {t("plugins.color-converter.label.preview")}
            </label>

            <div
              className="w-full h-40 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-inner transition-colors"
              style={{ backgroundColor: hex }}
            />

            <input
              type="color"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full h-10 cursor-pointer"
            />

            <div className="flex justify-center">
              <span
                className="text-2xl font-mono font-bold"
                style={{ color: hex }}
              >
                {hex.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              "#000000",
              "#ffffff",
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#ffff00",
              "#ff00ff",
              "#00ffff",
              "#ff8800",
            ].map((color) => (
              <button
                key={color}
                onClick={() => handleHexChange(color)}
                className="w-full h-10 rounded border border-neutral-300 dark:border-neutral-700 hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 space-y-4">
          {colorFormats.map(({ format, label, value, onChange }) => (
            <div key={format} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {label}
                </label>

                <button
                  onClick={() => copyToClipboard(format, value)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {copiedFormat === format ? (
                    <IoCheckmarkOutline className="text-lg text-green-500" />
                  ) : (
                    <IoCopyOutline className="text-lg" />
                  )}
                </button>
              </div>

              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 font-mono bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </CardSection>
  );
}