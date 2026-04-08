import { t } from "i18next";
import { plugins } from "../../utils/pluginLoader";
import { Link } from "react-router-dom";

export const Home = () => {
  const groupedPlugins = plugins.reduce((acc, plugin) => {
    const category = plugin.category || t("menu.utilities");
    if (!acc[category]) acc[category] = [];
    acc[category].push(plugin);
    return acc;
  }, {} as Record<string, typeof plugins>);

  return (
    <main className="col-span-12 md:col-span-8 xl:col-span-9 p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Tools
      </h1>

      {Object.entries(groupedPlugins).map(([category, pluginsInCategory]) => (
        <section key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t(category)}</h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pluginsInCategory.map((plugin) => {
              const Icon = plugin.icon;

              return (
                <Link
                  key={plugin.path}
                  to={plugin.path}
                  className="
                    group
                    rounded-xl
                    border border-neutral-300 dark:border-neutral-800
                    bg-white dark:bg-neutral-900
                    p-5
                    hover:border-neutral-400 dark:hover:border-neutral-700
                    hover:shadow-lg
                    transition
                  "
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="text-xl opacity-80 group-hover:opacity-100" />
                    <h3 className="font-medium">{t(plugin.name)}</h3>
                  </div>

                  {plugin.description && (
                    <p className="text-pretty text-sm text-neutral-500 dark:text-neutral-400">
                      {t(plugin.description)}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
};