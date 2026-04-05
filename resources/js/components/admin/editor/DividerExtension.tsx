import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React from 'react';
import { cn } from '@/lib/utils';
import {
    Minus,
    MoreHorizontal,
    Sparkles,
    Space,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Divider styles & widths                                            */
/* ------------------------------------------------------------------ */

export const DIVIDER_STYLES = [
    { value: 'line', icon: Minus, title: 'Solid line' },
    { value: 'dotted', icon: MoreHorizontal, title: 'Dotted' },
    { value: 'gradient', icon: Sparkles, title: 'Gradient' },
    { value: 'space', icon: Space, title: 'Space only' },
] as const;

export const DIVIDER_WIDTHS = [
    { value: 'full', label: '100%' },
    { value: 'three-quarter', label: '75%' },
    { value: 'half', label: '50%' },
    { value: 'third', label: '33%' },
] as const;

/* ------------------------------------------------------------------ */
/*  React NodeView                                                     */
/* ------------------------------------------------------------------ */

function DividerView(props: NodeViewProps) {
    const { node, updateAttributes, selected } = props;
    const { style = 'line', width = 'full' } = node.attrs;

    return (
        <NodeViewWrapper
            className={cn(
                'article-divider-block my-6',
                selected && 'ring-2 ring-blue-500 ring-offset-2 rounded',
            )}
        >
            {selected && (
                <div className="article-image-toolbar mb-2" contentEditable={false}>
                    <div className="toolbar-group">
                        <span className="toolbar-label">Style</span>
                        <div className="toolbar-buttons">
                            {DIVIDER_STYLES.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    className={cn('toolbar-btn', style === s.value && 'active')}
                                    onClick={() => updateAttributes({ style: s.value })}
                                    title={s.title}
                                >
                                    <s.icon className="h-3.5 w-3.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="toolbar-group">
                        <span className="toolbar-label">Width</span>
                        <div className="toolbar-buttons">
                            {DIVIDER_WIDTHS.map((w) => (
                                <button
                                    key={w.value}
                                    type="button"
                                    className={cn('toolbar-btn text-[10px]', width === w.value && 'active')}
                                    onClick={() => updateAttributes({ width: w.value })}
                                >
                                    {w.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={cn('article-divider', `article-divider-${style}`, `article-divider-w-${width}`)} />
        </NodeViewWrapper>
    );
}

/* ------------------------------------------------------------------ */
/*  Extension definition                                               */
/* ------------------------------------------------------------------ */

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        styledDivider: {
            setDivider: (options?: { style?: string; width?: string }) => ReturnType;
        };
    }
}

export const DividerExtension = Node.create({
    name: 'styledDivider',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {
            style: { default: 'line' },
            width: { default: 'full' },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="divider"]' }];
    },

    renderHTML({ node }) {
        const { style, width } = node.attrs;
        return [
            'div',
            {
                'data-type': 'divider',
                'data-style': style,
                'data-width': width,
                class: `article-divider article-divider-${style} article-divider-w-${width}`,
            },
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(DividerView);
    },

    addCommands() {
        return {
            setDivider:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            style: options?.style || 'line',
                            width: options?.width || 'full',
                        },
                    });
                },
        };
    },
});

export default DividerExtension;
