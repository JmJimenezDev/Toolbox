import { useState } from 'react';
import { CardSection } from '../../components/CardSection';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
import { t } from 'i18next';

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedPasswords, setCopiedPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePassword = () => {
    let characters = '';
    if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) characters += '0123456789';
    if (includeSymbols) characters += '!@#$%^&*()-+';
    if (!characters) return setGeneratedPassword('');

    let password = '';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setGeneratedPassword(password);
  }

  const copyToClipboard = (pwd: string, index?: number) => {
    if (!pwd) return;
    navigator.clipboard.writeText(pwd);
    if (typeof index === 'number') {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedPasswords(prev => [pwd, ...prev.slice(0, 4)]);
      setCopiedIndex(0);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  const calculateStrength = () => {
    let pool = 0;
    if (includeUppercase) pool += 26;
    if (includeLowercase) pool += 26;
    if (includeNumbers) pool += 10;
    if (includeSymbols) pool += 14;
    const entropy = Math.log2(pool) * length;
    if (entropy < 28) return 0;
    if (entropy < 36) return 1;
    if (entropy < 60) return 2;
    if (entropy < 128) return 3;
    return 4;
  }

  const strength = calculateStrength();
  const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
  const strengthLabels = [t("plugins.password-generator.types.very-weak"), t("plugins.password-generator.types.weak"), t("plugins.password-generator.types.medium"), t("plugins.password-generator.types.strong"), t("plugins.password-generator.types.very-strong")];

  return <CardSection title={t("plugins.password-generator.title")} description={t("plugins.password-generator.description")}>
    <div className='flex justify-center items-center gap-1'>
      <input type="text" readOnly disabled value={generatedPassword}
        className="w-full p-2 text-lg font-mono bg-neutral-200 dark:bg-neutral-800 rounded"
      />
      <button onClick={() => copyToClipboard(generatedPassword)} aria-label={t("alts.copy")}
        className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400"
        title={t("alts.copy")}>
        {copiedIndex === 0 ? <IoCheckmarkOutline className="text-lg" /> : <IoCopyOutline className="text-lg" />}
      </button>
    </div>

    <div className='mt-5 flex justify-between gap-5 items-center'>
      <div className='grid grid-cols-4 gap-2 w-full h-2'>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`${i <= strength ? strengthColors[strength] : 'bg-neutral-200 dark:bg-neutral-800'} p-0.5`}></div>
        ))}
      </div>
      <span className='w-28 text-end'>{strengthLabels[strength]}</span>
    </div>

    <div className="flex flex-col gap-2 mt-5 p-2 border border-neutral-300 dark:border-neutral-700 rounded">
      <div className="flex justify-between items-center">
        <label htmlFor="password-length" className="text-sm">{t("plugins.password-generator.label.length")}</label>
        <span className="text-sm">{length}</span>
      </div>
      <input
        id="password-length"
        type="range"
        min={6}
        max={64}
        value={length}
        onChange={(e) => setLength(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none bg-neutral-200 dark:bg-neutral-700 accent-green-600 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-neutral-400 font-mono">
        <span>6</span>
        <span>64</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
      {[
        { label: t("plugins.password-generator.label.uppercase"), state: includeUppercase, toggle: () => setIncludeUppercase(!includeUppercase), info: 'A-Z' },
        { label: t("plugins.password-generator.label.lowercase"), state: includeLowercase, toggle: () => setIncludeLowercase(!includeLowercase), info: 'a-z' },
        { label: t("plugins.password-generator.label.numbers"), state: includeNumbers, toggle: () => setIncludeNumbers(!includeNumbers), info: '0-9' },
        { label: t("plugins.password-generator.label.symbols"), state: includeSymbols, toggle: () => setIncludeSymbols(!includeSymbols), info: '!@#$%^&*()-+' },
      ].map(({ label, state, toggle, info }) => (
        <label
          key={label}
          className="flex justify-between items-center p-2 border border-neutral-300 dark:border-neutral-700 rounded cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={state} onChange={toggle} />
            <span className="text-sm">{label}</span>
          </div>
          <span className="text-xs text-neutral-400 font-mono">{info}</span>
        </label>
      ))}
    </div>

    <button onClick={generatePassword} className="cursor-pointer w-full mt-5 py-2 px-4 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-800">
      {t("plugins.password-generator.label.generate")}
    </button>

    <hr className="my-5 border-t border-neutral-300 dark:border-neutral-700" />
    <div className='flex justify-between items-center'>
      <h3 className="md:text-lg font-bold">{t("plugins.password-generator.label.last-copied")}</h3>
      {copiedPasswords.length > 0 && <button onClick={() => setCopiedPasswords([])} className="text-sm text-red-500 hover:underline">{t("commons.clear")}</button>}
    </div>
    <div className="mt-2 flex flex-col gap-2">
      {copiedPasswords.map((pwd, index) => (
        <div key={index} className="flex justify-between items-center gap-2">
          <div className="w-full p-2 text-lg font-mono bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden whitespace-nowrap text-ellipsis">
            {pwd}
          </div>
          <button onClick={() => copyToClipboard(pwd, index)} aria-label={t("alts.copy")}
            className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400"
            title={t("alts.copy")}>
            {copiedIndex === index ? <IoCheckmarkOutline className="text-lg" /> : <IoCopyOutline className="text-lg" />}
          </button>
        </div>
      ))}
    </div>
  </CardSection>;
}