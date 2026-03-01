import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Play, Headphones, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string | null;
    media_type: 'audio' | 'video';
    formatted_duration: string;
    category?: { name: string } | null;
}

interface PodcastSearchProps {
    className?: string;
    placeholder?: string;
}

export function PodcastSearch({ className, placeholder = 'Search podcasts...' }: PodcastSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const searchPodcasts = useCallback(async (term: string) => {
        if (term.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/podcasts/search?q=${encodeURIComponent(term)}`);
            const data = await res.json();
            setResults(data.data || []);
            setIsOpen(true);
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchPodcasts(query), 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, searchPodcasts]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            window.location.href = `/podcasts/${results[selectedIndex].slug}`;
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={containerRef} className={cn('relative', className)}>
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>

            {/* Dropdown results */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            <div className="inline-block size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                            Searching...
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No podcasts found for "{query}"
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto">
                            {results.map((result, index) => (
                                <a
                                    key={result.id}
                                    href={`/podcasts/${result.slug}`}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors',
                                        index === selectedIndex && 'bg-accent/50'
                                    )}
                                >
                                    <div className="size-10 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                                        {result.thumbnail_url ? (
                                            <img src={result.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            result.media_type === 'video'
                                                ? <Video className="size-4 text-primary/50" />
                                                : <Headphones className="size-4 text-primary/50" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{result.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            {result.category && <span>{result.category.name}</span>}
                                            <span>•</span>
                                            <span>{result.formatted_duration}</span>
                                        </div>
                                    </div>
                                    <Play className="size-4 text-muted-foreground shrink-0" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
