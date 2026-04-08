import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoCheckmarkOutline, IoCopyOutline, IoRefreshOutline } from 'react-icons/io5';
import { CardSection } from '../../components/CardSection';

interface PasswordOptions {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  bgColor: string;
}

export default function PasswordGenerator() {
  const { t } = useTranslation();
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<PasswordOptions>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const generateInitialPassword = () => {
    const charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let chars = '';
    const required: string[] = [];
    const defaultOptions = { uppercase: true, lowercase: true, numbers: true, symbols: true };
    const length = 16;

    if (defaultOptions.uppercase) {
      chars += charSets.uppercase;
      required.push(charSets.uppercase[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.uppercase.length)]);
    }
    if (defaultOptions.lowercase) {
      chars += charSets.lowercase;
      required.push(charSets.lowercase[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.lowercase.length)]);
    }
    if (defaultOptions.numbers) {
      chars += charSets.numbers;
      required.push(charSets.numbers[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.numbers.length)]);
    }
    if (defaultOptions.symbols) {
      chars += charSets.symbols;
      required.push(charSets.symbols[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.symbols.length)]);
    }

    if (!chars) return '';

    const remainingLength = Math.max(0, length - required.length);
    const result = [...required];

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0];
      result.push(chars[Math.floor(randomIndex / (0xFFFFFFFF + 1) * chars.length)]);
    }

    for (let i = result.length - 1; i > 0; i--) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0];
      const j = Math.floor(randomIndex / (0xFFFFFFFF + 1) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result.join('');
  };

  const [password, setPassword] = useState(generateInitialPassword());
  const [copiedPasswords, setCopiedPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getStrength = (password: string, options: PasswordOptions): StrengthResult => {
    if (!password) {
      return { score: 0, label: '', color: '', bgColor: 'bg-neutral-200 dark:bg-neutral-800' };
    }

    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (password.length >= 20) score += 1;

    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 1;

    if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
      score = 0;
    }

    if (score <= 2) {
      return {
        score: 0,
        label: t("plugins.password-generator.types.very-weak"),
        color: 'text-red-500',
        bgColor: 'bg-red-500'
      };
    } else if (score <= 4) {
      return {
        score: 1,
        label: t("plugins.password-generator.types.weak"),
        color: 'text-orange-400',
        bgColor: 'bg-orange-400'
      };
    } else if (score <= 5) {
      return {
        score: 2,
        label: t("plugins.password-generator.types.medium"),
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-400'
      };
    } else if (score <= 7) {
      return {
        score: 3,
        label: t("plugins.password-generator.types.strong"),
        color: 'text-green-500',
        bgColor: 'bg-green-400'
      };
    } else {
      return {
        score: 4,
        label: t("plugins.password-generator.types.very-strong"),
        color: 'text-green-600',
        bgColor: 'bg-green-600'
      };
    }
  };

  const strength = getStrength(password, options);

  const generatePassword = () => {
    const charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let chars = '';
    const required: string[] = [];

    if (options.uppercase) {
      chars += charSets.uppercase;
      required.push(charSets.uppercase[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.uppercase.length)]);
    }
    if (options.lowercase) {
      chars += charSets.lowercase;
      required.push(charSets.lowercase[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.lowercase.length)]);
    }
    if (options.numbers) {
      chars += charSets.numbers;
      required.push(charSets.numbers[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.numbers.length)]);
    }
    if (options.symbols) {
      chars += charSets.symbols;
      required.push(charSets.symbols[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.symbols.length)]);
    }

    if (!chars) {
      setPassword('');
      return;
    }

    const remainingLength = Math.max(0, length - required.length);
    const result = [...required];

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0];
      result.push(chars[Math.floor(randomIndex / (0xFFFFFFFF + 1) * chars.length)]);
    }

    for (let i = result.length - 1; i > 0; i--) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0];
      const j = Math.floor(randomIndex / (0xFFFFFFFF + 1) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    setPassword(result.join(''));
  };


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
  };

  const toggleOption = (key: keyof PasswordOptions) => {
    const newOptions = { ...options, [key]: !options[key] };
    const hasAny = Object.values(newOptions).some(v => v);
    if (!hasAny) return;
    setOptions(newOptions);
    generatePasswordWithOptions(newOptions, length);
  };

  const generatePasswordWithOptions = (opts: PasswordOptions, len: number) => {
    const charSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let chars = '';
    const required: string[] = [];

    if (opts.uppercase) {
      chars += charSets.uppercase;
      required.push(charSets.uppercase[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.uppercase.length)]);
    }
    if (opts.lowercase) {
      chars += charSets.lowercase;
      required.push(charSets.lowercase[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.lowercase.length)]);
    }
    if (opts.numbers) {
      chars += charSets.numbers;
      required.push(charSets.numbers[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.numbers.length)]);
    }
    if (opts.symbols) {
      chars += charSets.symbols;
      required.push(charSets.symbols[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * charSets.symbols.length)]);
    }

    if (!chars) {
      setPassword('');
      return;
    }

    const remainingLength = Math.max(0, len - required.length);
    const result = [...required];

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0];
      result.push(chars[Math.floor(randomIndex / (0xFFFFFFFF + 1) * chars.length)]);
    }

    for (let i = result.length - 1; i > 0; i--) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0];
      const j = Math.floor(randomIndex / (0xFFFFFFFF + 1) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    setPassword(result.join(''));
  };

  const handleLengthChange = (newLength: number) => {
    setLength(newLength);
    generatePasswordWithOptions(options, newLength);
  };

  return <CardSection title={t("plugins.password-generator.title")} description={t("plugins.password-generator.description")}>
    <div className='flex justify-center items-center gap-2'>
      <input type="text" readOnly value={password}
        className="w-full p-3 text-lg font-mono bg-neutral-200 dark:bg-neutral-800 rounded"
      />
      <button onClick={generatePassword} aria-label={t("plugins.password-generator.label.generate")}
        className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-neutral-500"
        title={t("plugins.password-generator.label.generate")}>
        <IoRefreshOutline className="text-xl" />
      </button>
      <button onClick={() => copyToClipboard(password)} aria-label={t("alts.copy")}
        className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-3 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-neutral-400"
        title={t("alts.copy")}>
        {copiedIndex === 0 ? <IoCheckmarkOutline className="text-lg text-green-500" /> : <IoCopyOutline className="text-lg" />}
      </button>
    </div>

    <div className='mt-5 flex justify-between gap-5 items-center'>
      <div className='grid grid-cols-4 gap-2 w-full h-2'>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`${i <= strength.score ? strength.bgColor : 'bg-neutral-200 dark:bg-neutral-800'} rounded-full transition-colors`}></div>
        ))}
      </div>
      <span className={`w-32 text-end text-sm font-medium ${strength.color}`}>{strength.label}</span>
    </div>

    <div className="flex flex-col gap-2 mt-5 p-3 border border-neutral-300 dark:border-neutral-700 rounded">
      <div className="flex justify-between items-center">
        <label htmlFor="password-length" className="text-sm">{t("plugins.password-generator.label.length")}</label>
        <span className="text-sm font-mono font-bold">{length}</span>
      </div>
      <input
        id="password-length"
        type="range"
        min={8}
        max={64}
        value={length}
        onChange={(e) => handleLengthChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none bg-neutral-200 dark:bg-neutral-700 accent-green-600 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-neutral-400 font-mono">
        <span>8</span>
        <span>64</span>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
      {[
        { key: 'uppercase' as const, label: t("plugins.password-generator.label.uppercase"), info: 'A-Z' },
        { key: 'lowercase' as const, label: t("plugins.password-generator.label.lowercase"), info: 'a-z' },
        { key: 'numbers' as const, label: t("plugins.password-generator.label.numbers"), info: '0-9' },
        { key: 'symbols' as const, label: t("plugins.password-generator.label.symbols"), info: '!@#$%' },
      ].map(({ key, label, info }) => (
        <button
          key={key}
          onClick={() => toggleOption(key)}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${options[key]
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : 'border-neutral-300 dark:border-neutral-700 text-neutral-400'
            }`}
        >
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs font-mono opacity-60">{info}</span>
        </button>
      ))}
    </div>

    <hr className="my-5 border-t border-neutral-300 dark:border-neutral-700" />
    <div className='flex justify-between items-center'>
      <h3 className="md:text-lg font-bold">{t("plugins.password-generator.label.last-copied")}</h3>
      {copiedPasswords.length > 0 && <button onClick={() => setCopiedPasswords([])} aria-label={t("commons.clear")} className="text-sm text-red-500 hover:underline">{t("commons.clear")}</button>}
    </div>
    <div className="mt-2 flex flex-col gap-2">
      {copiedPasswords.length === 0 && <p className="text-sm text-neutral-400 italic">{t("commons.loading")}</p>}
      {copiedPasswords.map((pwd, index) => (
        <div key={index} className="flex justify-between items-center gap-2">
          <div className="w-full p-2 text-sm font-mono bg-neutral-200 dark:bg-neutral-800 rounded overflow-hidden whitespace-nowrap text-ellipsis">
            {pwd}
          </div>
          <button onClick={() => copyToClipboard(pwd, index)} aria-label={t("alts.copy")}
            className="border border-neutral-300 dark:border-neutral-700 cursor-pointer p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-950 text-xs text-neutral-400"
            title={t("alts.copy")}>
            {copiedIndex === index ? <IoCheckmarkOutline className="text-lg text-green-500" /> : <IoCopyOutline className="text-lg" />}
          </button>
        </div>
      ))}
    </div>
  </CardSection>;
}