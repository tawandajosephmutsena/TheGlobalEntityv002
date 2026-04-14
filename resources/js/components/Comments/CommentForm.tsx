import { useForm, usePage } from '@inertiajs/react';
import { Send, LogIn } from 'lucide-react';
import React, { useRef } from 'react';
import { User } from '@/types';

interface Props {
    insightSlug: string;
    parentId?: number | null;
    placeholder?: string;
    onCancel?: () => void;
    compact?: boolean;
}

export default function CommentForm({ insightSlug, parentId = null, placeholder = 'Share your thoughts...', onCancel, compact = false }: Props) {
    const { auth } = usePage().props as { auth?: { user?: User } };
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
        parent_id: parentId,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/blog/${insightSlug}/comments`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('body');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
                onCancel?.();
            },
        });
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData('body', e.target.value);
        // Auto-resize
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
    };

    if (!auth?.user) {
        return (
            <div className={`flex items-center gap-4 p-6 rounded-2xl bg-agency-secondary/50 dark:bg-white/5 border border-agency-primary/5 dark:border-white/5 ${compact ? 'p-4' : ''}`}>
                <LogIn className="size-5 opacity-40 shrink-0" />
                <p className="text-sm opacity-60">
                    <a href="/login" className="text-agency-accent font-bold hover:underline">Sign in</a> to join the conversation.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={compact ? '' : 'mb-8'}>
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                    {auth.user.avatar ? (
                        <img src={auth.user.avatar} alt={auth.user.name} className={`rounded-full object-cover border-2 border-agency-accent/20 ${compact ? 'size-8' : 'size-10'}`} />
                    ) : (
                        <div className={`rounded-full bg-agency-accent/10 flex items-center justify-center text-agency-accent font-bold ${compact ? 'size-8 text-xs' : 'size-10 text-sm'}`}>
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        value={data.body}
                        onChange={handleTextareaChange}
                        placeholder={placeholder}
                        rows={compact ? 1 : 3}
                        className={`w-full bg-transparent border border-agency-primary/10 dark:border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-agency-accent/30 focus:border-agency-accent/50 resize-none transition-all placeholder:opacity-40
                            ${compact ? 'rounded-xl px-3 py-2 text-xs' : ''}`}
                    />
                    {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}

                    <div className={`flex items-center justify-between mt-3 ${compact ? 'mt-2' : ''}`}>
                        <span className={`text-[10px] font-bold tracking-widest opacity-30 ${data.body.length > 1800 ? 'text-red-500 opacity-100' : ''}`}>
                            {data.body.length}/2000
                        </span>
                        <div className="flex items-center gap-2">
                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-4 py-2 rounded-full text-xs font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={processing || !data.body.trim()}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full bg-agency-accent text-agency-primary font-bold uppercase tracking-widest transition-all
                                    ${compact ? 'text-[10px] px-3 py-1.5' : 'text-xs'}
                                    ${processing || !data.body.trim() ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg active:scale-95'}
                                `}
                            >
                                <Send className={compact ? 'size-3' : 'size-3.5'} />
                                {processing ? 'Posting...' : (parentId ? 'Reply' : 'Comment')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
