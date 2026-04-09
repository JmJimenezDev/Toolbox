import React from 'react';
import { cn } from '../utils/cn';
import { useCurrentPlugin } from '../utils/useCurrentPlugin';

export const CardSection = ({ children, title, description, className }: { children: React.ReactNode; title: string; description?: string; className?: string }) => {
    const plugin = useCurrentPlugin();

    return <div className={cn("mx-auto border border-neutral-300 dark:border-neutral-700 rounded-lg p-6 shadow-xl h-max max-w-xl mt-10 lg:mt-20", className)}>
        <div className="flex items-center gap-3 mb-2">
            {plugin && plugin.icon && <plugin.icon className="text-2xl" />}
            <h1>{title}</h1>
        </div>
        {description && <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{description}</p>}
        <hr className="border-t border-neutral-300 dark:border-neutral-700 mb-4" />
        {children}
    </div>
}
