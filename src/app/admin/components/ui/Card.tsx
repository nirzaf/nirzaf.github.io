'use client';

import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return <div className={`card ${className}`.trim()}>{children}</div>;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return <div className={`card-header ${className}`.trim()}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <h3 className={`card-title ${className}`.trim()}>{children}</h3>;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
    return <div className={`card-body ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return <div className={`card-footer ${className}`.trim()}>{children}</div>;
}
