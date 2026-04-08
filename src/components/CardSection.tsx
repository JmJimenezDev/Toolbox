import React from 'react'
import { cn } from '../utils/cn';

export const CardSection = ({ children, title, description, className }: { children: React.ReactNode; title: string; description?: string; className?: string }) => {
    return <div className={cn("mx-auto border border-neutral-300 dark:border-neutral-700 rounded-lg p-6 shadow-xl h-max max-w-xl mt-10 md:mt-20", className)}>
        <h1 className='mb-2'>{title}</h1>
        {description && <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{description}</p>}
        <hr className="border-t border-neutral-300 dark:border-neutral-700 mb-4" />
        {children}
    </div>
}
