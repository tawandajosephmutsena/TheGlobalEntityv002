import { ReactionType, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Heart, ThumbsUp, Trophy, Lightbulb } from 'lucide-react';
import React, { useState } from 'react';

interface ReactionCounts {
    [key: string]: number;
}

interface Props {
    reactableId: number;
    reactableType: 'insight' | 'comment';
    counts: ReactionCounts;
    userReaction: ReactionType | null;
    compact?: boolean;
}

const reactionConfig: { type: ReactionType; icon: React.ElementType; label: string; color: string; bg: string }[] = [
    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-500', bg: 'bg-blue-500/10 hover:bg-blue-500/20' },
    { type: 'love', icon: Heart, label: 'Love', color: 'text-red-500', bg: 'bg-red-500/10 hover:bg-red-500/20' },
    { type: 'celebrate', icon: Trophy, label: 'Celebrate', color: 'text-yellow-500', bg: 'bg-yellow-500/10 hover:bg-yellow-500/20' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-purple-500', bg: 'bg-purple-500/10 hover:bg-purple-500/20' },
];

export default function ReactionButton({ reactableId, reactableType, counts: initialCounts, userReaction: initialUserReaction, compact = false }: Props) {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const [counts, setCounts] = useState<ReactionCounts>(initialCounts || {});
    const [userReaction, setUserReaction] = useState<ReactionType | null>(initialUserReaction);
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const totalReactions = Object.values(counts).reduce((sum, count) => sum + count, 0);

    const handleReaction = async (type: ReactionType) => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        if (isLoading) return;
        setIsLoading(true);
        setShowPicker(false);

        try {
            const response = await fetch('/reactions/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    reactable_id: reactableId,
                    reactable_type: reactableType,
                    type,
                }),
            });

            const data = await response.json();
            setCounts(data.counts || {});
            setUserReaction(data.user_reaction || null);
        } catch (error) {
            console.error('Failed to toggle reaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const activeReaction = reactionConfig.find(r => r.type === userReaction);

    if (compact) {
        return (
            <div className="relative inline-flex items-center gap-1">
                <div className="relative">
                    <button
                        onClick={() => userReaction ? handleReaction(userReaction) : setShowPicker(!showPicker)}
                        onMouseEnter={() => setShowPicker(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
                            ${userReaction ? `${activeReaction?.bg} ${activeReaction?.color}` : 'bg-agency-primary/5 dark:bg-white/5 hover:bg-agency-primary/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100'}`}
                    >
                        {activeReaction ? <activeReaction.icon className="size-3.5" /> : <ThumbsUp className="size-3.5" />}
                        {totalReactions > 0 && <span>{totalReactions}</span>}
                    </button>

                    {showPicker && (
                        <div
                            className="absolute bottom-full left-0 mb-2 flex items-center gap-1 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-bottom-2"
                            onMouseLeave={() => setShowPicker(false)}
                        >
                            {reactionConfig.map(reaction => (
                                <button
                                    key={reaction.type}
                                    onClick={() => handleReaction(reaction.type)}
                                    title={reaction.label}
                                    className={`p-2 rounded-full transition-all duration-200 hover:scale-125
                                        ${userReaction === reaction.type ? `${reaction.bg} ${reaction.color}` : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                >
                                    <reaction.icon className={`size-4 ${userReaction === reaction.type ? reaction.color : ''}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Reaction Summary Row */}
            {totalReactions > 0 && (
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-1">
                        {reactionConfig
                            .filter(r => (counts[r.type] || 0) > 0)
                            .map(r => (
                                <div key={r.type} className={`size-6 rounded-full flex items-center justify-center ${r.bg} ${r.color} border-2 border-white dark:border-gray-900`}>
                                    <r.icon className="size-3" />
                                </div>
                            ))
                        }
                    </div>
                    <span className="text-sm font-medium opacity-60">
                        {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
                    </span>
                </div>
            )}

            {/* Reaction Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
                {reactionConfig.map(reaction => {
                    const count = counts[reaction.type] || 0;
                    const isActive = userReaction === reaction.type;

                    return (
                        <button
                            key={reaction.type}
                            onClick={() => handleReaction(reaction.type)}
                            disabled={isLoading}
                            className={`group flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
                                ${isActive
                                    ? `${reaction.bg} ${reaction.color} ring-2 ring-current/20 scale-105`
                                    : 'bg-agency-primary/5 dark:bg-white/5 hover:bg-agency-primary/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100'
                                }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}
                            `}
                        >
                            <reaction.icon className={`size-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'animate-bounce-once' : ''}`} />
                            <span>{reaction.label}</span>
                            {count > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white/20' : 'bg-agency-primary/10 dark:bg-white/10'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
