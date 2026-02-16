import { Comment as CommentType, ReactionType, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Reply, Trash2, MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import CommentForm from './CommentForm';
import ReactionButton from '../Reactions/ReactionButton';

interface Props {
    comment: CommentType;
    insightSlug: string;
    insightId: number;
    depth?: number;
}

function getReactionCounts(reactions?: CommentType['reactions']): Record<string, number> {
    if (!reactions) return {};
    const counts: Record<string, number> = {};
    reactions.forEach(r => {
        counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
}

function getUserReaction(reactions?: CommentType['reactions'], userId?: number): ReactionType | null {
    if (!reactions || !userId) return null;
    const found = reactions.find(r => r.user_id === userId);
    return found ? found.type : null;
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
}

export default function CommentItem({ comment, insightSlug, insightId, depth = 0 }: Props) {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const isAuthor = auth?.user?.id === comment.user_id;
    const isAdmin = auth?.user && 'role' in auth.user && auth.user.role === 'admin';
    const canDelete = isAuthor || isAdmin;
    const maxDepth = 3;

    const handleDelete = () => {
        if (!confirm('Delete this comment?')) return;
        router.delete(`/comments/${comment.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className={`group ${depth > 0 ? 'ml-8 pl-6 border-l-2 border-agency-primary/5 dark:border-white/5' : ''}`}>
            <div className="py-5">
                {/* Comment Header */}
                <div className="flex items-start gap-3 mb-3">
                    {/* Avatar */}
                    {comment.user?.avatar ? (
                        <img
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            className="size-9 rounded-full object-cover border-2 border-agency-accent/10 shrink-0"
                        />
                    ) : (
                        <div className="size-9 rounded-full bg-agency-accent/10 flex items-center justify-center text-agency-accent font-bold text-xs shrink-0">
                            {comment.user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm">{comment.user?.name || 'Anonymous'}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">
                                {timeAgo(comment.created_at)}
                            </span>
                        </div>

                        {/* Comment Body */}
                        <p className="text-sm leading-relaxed mt-1.5 opacity-80 whitespace-pre-wrap break-words">
                            {comment.body}
                        </p>

                        {/* Comment Actions */}
                        <div className="flex items-center gap-3 mt-3">
                            {/* Reactions on comment */}
                            <ReactionButton
                                reactableId={comment.id}
                                reactableType="comment"
                                counts={getReactionCounts(comment.reactions)}
                                userReaction={getUserReaction(comment.reactions, auth?.user?.id)}
                                compact
                            />

                            {/* Reply button */}
                            {depth < maxDepth && (
                                <button
                                    onClick={() => auth?.user ? setShowReplyForm(!showReplyForm) : router.visit('/login')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider opacity-40 hover:opacity-100 hover:bg-agency-primary/5 dark:hover:bg-white/5 transition-all"
                                >
                                    <Reply className="size-3.5" />
                                    Reply
                                </button>
                            )}

                            {/* Delete / More */}
                            {canDelete && (
                                <div className="relative ml-auto">
                                    <button
                                        onClick={() => setShowActions(!showActions)}
                                        className="p-1.5 rounded-full opacity-0 group-hover:opacity-40 hover:!opacity-100 hover:bg-red-500/10 transition-all"
                                        title="More actions"
                                        aria-label="More actions"
                                    >
                                        <MoreHorizontal className="size-4" />
                                    </button>
                                    {showActions && (
                                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 py-1 z-50 min-w-[120px]">
                                            <button
                                                onClick={handleDelete}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="size-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                    <div className="ml-12 mt-3">
                        <CommentForm
                            insightSlug={insightSlug}
                            parentId={comment.id}
                            placeholder={`Reply to ${comment.user?.name || 'this comment'}...`}
                            onCancel={() => setShowReplyForm(false)}
                            compact
                        />
                    </div>
                )}
            </div>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div>
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            insightSlug={insightSlug}
                            insightId={insightId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
