import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AsideMenu } from '../core/layout/AsideMenu';
import { Header } from '../core/layout/Header';
import { plugins } from '../utils/pluginLoader';

export const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentPlugin = plugins.find(p => p.path === location.pathname);
    const toolName = currentPlugin ? t(currentPlugin.name) : '';
    document.title = toolName 
      ? `${toolName} | JmJimenezToolbox` 
      : 'JmJimenezToolbox';
  }, [location.pathname, t]);

  return (
    <div className="dark:bg-neutral-900 dark:text-neutral-200 bg-neutral-100 text-neutral-800">
      <div className={`${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-600 ease-in-out w-full h-screen grid grid-rows-[auto_1fr] overflow-hidden`}>
        <Header />
        <div className="xl:px-0 grid grid-cols-12 w-full min-h-0">
          <aside className="md:flex flex-col hidden col-span-4 xl:col-span-3 border-r border-neutral-300 dark:border-neutral-800 h-full overflow-hidden">
            <AsideMenu />
          </aside>

          <main className="py-3 px-1 col-span-12 md:col-span-8 xl:col-span-9 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

