import { useTranslation } from 'react-i18next';

export const Loader = () => {
    const { t } = useTranslation();
      
    return <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
        <div className="loader"></div>
        <p className="text-neutral-500">{t("commons.loading")}</p>
    </div>
}

