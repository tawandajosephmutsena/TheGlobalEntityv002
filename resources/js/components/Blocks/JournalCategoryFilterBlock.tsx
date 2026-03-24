"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { JournalCategoryFilterBlock } from '@/types/page-blocks';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    content: JournalCategoryFilterBlock['content'];
    categories: Category[];
}

export default function JournalCategoryFilterBlock({ content, categories = [] }: Props) {
    const { showAllLabel = "All Archives" } = content;
    const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');

    // This is a simplified version of the filter. 
    // In a real app, this would update the URL or a parent state.
    const handleCategoryClick = (id: number | 'all') => {
        setActiveCategoryId(id);
        // Dispatch custom event for ArticleGrid to listen to
        const event = new CustomEvent('journal-category-filter', { detail: id });
        window.dispatchEvent(event);
    };

    return (
        <section className="container mx-auto px-6 mb-16">
            <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-4">
                <button 
                    onClick={() => handleCategoryClick('all')}
                    className={cn(
                        "whitespace-nowrap px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500",
                        activeCategoryId === 'all' 
                            ? "bg-on-surface text-surface shadow-xl scale-105" 
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:scale-105"
                    )}
                >
                    {showAllLabel}
                </button>
                {categories.map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={cn(
                            "whitespace-nowrap px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500",
                            activeCategoryId === cat.id 
                                ? "bg-primary text-on-primary shadow-xl scale-105" 
                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:scale-105"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </section>
    );
}
