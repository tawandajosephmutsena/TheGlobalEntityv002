import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { FestivalFilterBarBlock } from '@/types/page-blocks';

interface FestivalFilterBarProps {
    searchPlaceholder?: string;
    categories?: Array<{
        id: string;
        label: string;
        count: string;
    }>;
}

const FestivalFilterBar: React.FC<FestivalFilterBarProps> = ({
    searchPlaceholder = "SEARCH ARCHIVES...",
    categories = [
        { id: 'all', label: 'All', count: '42' },
        { id: 'fairy', label: 'Fairy', count: '12' },
        { id: 'mystic', label: 'Mystic', count: '08' },
        { id: 'nomadic', label: 'Nomadic', count: '15' },
        { id: 'celestial', label: 'Celestial', count: '07' },
    ]
}) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabClick = (id: string) => {
        setActiveTab(id);
        const event = new CustomEvent('festival-category-filter', { detail: id });
        window.dispatchEvent(event);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        const event = new CustomEvent('festival-search-filter', { detail: query });
        window.dispatchEvent(event);
    };

    return (
        <section className="sticky top-0 z-40 w-full bg-agency-surface/80 backdrop-blur-xl border-b border-agency-primary/10">
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-center px-6 py-8">
                    {/* Search Box */}
                    <div className="relative group flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-agency-primary/40 group-focus-within:text-agency-accent transition-colors duration-500" />
                        <input 
                            type="text" 
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={cn(
                                "w-full bg-agency-primary/[0.03] border border-agency-primary/10 rounded-none px-14 py-5",
                                "text-[10px] font-mono tracking-tighter [font-variant-caps:small-caps] outline-none focus:ring-0",
                                "transition-all duration-500 focus:bg-agency-primary/[0.05] focus:border-agency-accent/30",
                                "placeholder:text-agency-primary/20"
                            )}
                        />
                        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-agency-accent transition-all duration-700 group-focus-within:w-full" />
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => handleTabClick(cat.id)}
                                className={cn(
                                    "whitespace-nowrap px-8 py-5 border text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter transition-all duration-500",
                                    activeTab === cat.id 
                                        ? "bg-agency-primary text-agency-surface border-agency-primary scale-105 z-10 shadow-2xl" 
                                        : "bg-agency-primary/[0.03] border-agency-primary/10 text-agency-primary/60 hover:bg-agency-primary/5 hover:border-agency-primary/30"
                                )}
                            >
                                {cat.label}
                                <span className={cn(
                                    "ml-3 font-mono text-[9px]",
                                    activeTab === cat.id ? "text-agency-surface/50" : "text-agency-primary/30"
                                )}>
                                    [{cat.count}]
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grain Texture Overlay (Subtle) */}
            <div className="absolute inset-0 z-[-1] opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </section>
    );
};

export default FestivalFilterBar;
