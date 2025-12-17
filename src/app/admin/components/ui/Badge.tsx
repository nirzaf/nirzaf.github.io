'use client';

import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'primary';
    className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
    return (
        <span className={`badge badge-${variant} ${className}`.trim()}>
            {children}
        </span>
    );
}
