import { Comment as CommentType } from '@/types';
import { MessageCircle } from 'lucide-react';
import React from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface Props {
    insightSlug: string;
    insightId: number;
    comments: CommentType[];
}

export default function CommentSection({ insightSlug, insightId, comments }: Props) {
    const commentCount = comments.length;

    return (
        <section className="mt-24 pt-16 border-t border-agency-primary/5 dark:border-white/5">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-12">
                <div className="size-12 rounded-full bg-agency-accent/10 flex items-center justify-center">
                    <MessageCircle className="size-5 text-agency-accent" />
                </div>
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">
                        Discussion
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 mt-1">
                        {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                    </p>
                </div>
            </div>

            {/* Comment Form */}
            <CommentForm insightSlug={insightSlug} />

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="divide-y divide-agency-primary/5 dark:divide-white/5">
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            insightSlug={insightSlug}
                            insightId={insightId}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <MessageCircle className="size-8 mx-auto mb-4 opacity-10" />
                    <p className="text-sm opacity-30 font-bold uppercase tracking-widest">
                        Be the first to comment
                    </p>
                </div>
            )}
        </section>
    );
}
