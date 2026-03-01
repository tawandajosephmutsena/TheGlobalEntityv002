import React, { useState, useCallback } from 'react';
import { Twitter, Facebook, Linkedin, Link2, Check, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ShareButtonsProps {
    url: string;
    title: string;
    className?: string;
    variant?: 'default' | 'icon-only';
}

export function ShareButtons({ url, title, className, variant = 'default' }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: 'Twitter / X',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:bg-sky-500/10 hover:text-sky-500',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:bg-blue-600/10 hover:text-blue-600',
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'hover:bg-blue-700/10 hover:text-blue-700',
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: 'hover:bg-green-500/10 hover:text-green-500',
        },
    ];

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [url]);

    if (variant === 'icon-only') {
        return (
            <TooltipProvider>
                <div className={cn('flex items-center gap-1', className)}>
                    {shareLinks.map((link) => (
                        <Tooltip key={link.name}>
                            <TooltipTrigger asChild>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        'p-2 rounded-lg text-muted-foreground transition-all duration-200',
                                        link.color
                                    )}
                                >
                                    <link.icon className="size-4" />
                                </a>
                            </TooltipTrigger>
                            <TooltipContent>{link.name}</TooltipContent>
                        </Tooltip>
                    ))}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={copyToClipboard}
                                className={cn(
                                    'p-2 rounded-lg text-muted-foreground transition-all duration-200',
                                    copied
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'hover:bg-primary/10 hover:text-primary'
                                )}
                            >
                                {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{copied ? 'Copied!' : 'Copy link'}</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        );
    }

    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border transition-all duration-200',
                        link.color
                    )}
                >
                    <link.icon className="size-4" />
                    <span className="hidden sm:inline">{link.name}</span>
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className={cn(
                    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border border-border transition-all duration-200',
                    copied
                        ? 'bg-green-500/10 text-green-500 border-green-500/30'
                        : 'text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                )}
            >
                {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
        </div>
    );
}
