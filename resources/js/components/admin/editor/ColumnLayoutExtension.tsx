import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
    Columns2,
    Columns3,
    PanelLeftClose,
    PanelRightClose,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Layout presets                                                     */
/* ------------------------------------------------------------------ */

export const COLUMN_LAYOUTS = [
    { value: '1-1', label: '50 / 50', icon: Columns2, cols: 2, grid: 'grid-cols-2' },
    { value: '1-1-1', label: '33 / 33 / 33', icon: Columns3, cols: 3, grid: 'grid-cols-3' },
    { value: '2-1', label: '66 / 33', icon: PanelRightClose, cols: 2, grid: 'article-cols-2-1' },
    { value: '1-2', label: '33 / 66', icon: PanelLeftClose, cols: 2, grid: 'article-cols-1-2' },
] as const;

/* ------------------------------------------------------------------ */
/*  Column wrapper NodeView                                            */
/* ------------------------------------------------------------------ */

function ColumnLayoutView(props: NodeViewProps) {
    const { node, updateAttributes, selected } = props;
    const layout = node.attrs.layout || '1-1';

    const gridClass =
        layout === '1-1'
            ? 'grid-cols-2'
            : layout === '1-1-1'
              ? 'grid-cols-3'
              : layout === '2-1'
                ? 'article-cols-2-1'
                : layout === '1-2'
                  ? 'article-cols-1-2'
                  : 'grid-cols-2';

    return (
        <NodeViewWrapper
            className={cn(
                'article-column-layout my-6',
                selected && 'ring-2 ring-blue-500 ring-offset-2 rounded-lg',
            )}
        >
            {/* Layout selector (only when selected) */}
            {selected && (
                <div className="article-column-toolbar" contentEditable={false}>
                    <span className="toolbar-label">Layout</span>
                    <div className="toolbar-buttons">
                        {COLUMN_LAYOUTS.map((l) => (
                            <button
                                key={l.value}
                                type="button"
                                className={cn('toolbar-btn', layout === l.value && 'active')}
                                onClick={() => updateAttributes({ layout: l.value })}
                                title={l.label}
                            >
                                <l.icon className="h-3.5 w-3.5" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={cn('grid gap-4 md:gap-6', gridClass)}>
                <NodeViewContent className="article-column-content" />
            </div>
        </NodeViewWrapper>
    );
}

/* ------------------------------------------------------------------ */
/*  Column (child) NodeView                                            */
/* ------------------------------------------------------------------ */

function ColumnView(props: NodeViewProps) {
    return (
        <NodeViewWrapper className="article-column min-h-[60px] border border-dashed border-muted-foreground/20 rounded-lg p-3 hover:border-muted-foreground/40 transition-colors">
            <NodeViewContent />
        </NodeViewWrapper>
    );
}

/* ------------------------------------------------------------------ */
/*  Column Node (child of ColumnLayout)                                */
/* ------------------------------------------------------------------ */

const ColumnNode = Node.create({
    name: 'column',

    content: 'block+',

    defining: true,

    parseHTML() {
        return [{ tag: 'div[data-type="column"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'column',
                class: 'article-column',
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ColumnView);
    },
});

/* ------------------------------------------------------------------ */
/*  ColumnLayout Node (parent)                                         */
/* ------------------------------------------------------------------ */

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        columnLayout: {
            setColumnLayout: (options?: { layout?: string }) => ReturnType;
        };
    }
}

const ColumnLayoutNode = Node.create({
    name: 'columnLayout',

    group: 'block',

    content: 'column+',

    defining: true,

    addAttributes() {
        return {
            layout: { default: '1-1' },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="column-layout"]' }];
    },

    renderHTML({ node, HTMLAttributes }) {
        const layout = node.attrs.layout || '1-1';
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'column-layout',
                'data-layout': layout,
                class: `article-columns article-columns-${layout}`,
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ColumnLayoutView);
    },

    addCommands() {
        return {
            setColumnLayout:
                (options) =>
                ({ commands }) => {
                    const layout = options?.layout || '1-1';
                    const colCount = layout === '1-1-1' ? 3 : 2;
                    const columns = Array.from({ length: colCount }, () => ({
                        type: 'column',
                        content: [{ type: 'paragraph' }],
                    }));

                    return commands.insertContent({
                        type: 'columnLayout',
                        attrs: { layout },
                        content: columns,
                    });
                },
        };
    },
});

/* Export both nodes — parent + child must both be registered */
export { ColumnNode, ColumnLayoutNode };
export default ColumnLayoutNode;
