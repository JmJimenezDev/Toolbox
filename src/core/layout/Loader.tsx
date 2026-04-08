import { t } from 'i18next'

export const Loader = () => {
    return <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
        <div className="loader"></div>
        <p className="text-neutral-500">{t("commons.loading")}</p>
    </div>
}

