import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
    Image as ImageIcon,
    AlignLeft,
    AlignRight,
    AlignVerticalJustifyStart,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
    Square,
    RectangleHorizontal,
    Circle,
    Replace,
} from 'lucide-react';
import MediaLibrary from '../MediaLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/* ------------------------------------------------------------------ */
/*  Configuration options                                              */
/* ------------------------------------------------------------------ */

export const TEXT_IMAGE_POSITIONS = [
    { value: 'image-left', icon: AlignLeft, title: 'Image Left' },
    { value: 'image-right', icon: AlignRight, title: 'Image Right' },
] as const;

export const TEXT_IMAGE_RATIOS = [
    { value: '30-70', label: '30/70' },
    { value: '40-60', label: '40/60' },
    { value: '50-50', label: '50/50' },
    { value: '60-40', label: '60/40' },
] as const;

export const TEXT_IMAGE_VALIGNS = [
    { value: 'top', icon: AlignVerticalJustifyStart, title: 'Top' },
    { value: 'center', icon: AlignVerticalJustifyCenter, title: 'Center' },
    { value: 'bottom', icon: AlignVerticalJustifyEnd, title: 'Bottom' },
] as const;

export const TEXT_IMAGE_SHAPES = [
    { value: 'none', icon: Square, title: 'Square' },
    { value: 'rounded', icon: RectangleHorizontal, title: 'Rounded' },
    { value: 'circle', icon: Circle, title: 'Circle' },
] as const;

/* ------------------------------------------------------------------ */
/*  React NodeView                                                     */
/* ------------------------------------------------------------------ */

function TextImageView(props: NodeViewProps) {
    const { node, updateAttributes, selected } = props;
    const {
        src,
        alt,
        position = 'image-left',
        ratio = '40-60',
        valign = 'center',
        shape = 'none',
        text = '',
    } = node.attrs;

    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

    const handleUpdate = useCallback(
        (attrs: Record<string, string>) => updateAttributes(attrs),
        [updateAttributes],
    );

    // Derive CSS grid fractions from ratio
    const ratioMap: Record<string, [string, string]> = {
        '30-70': ['3fr', '7fr'],
        '40-60': ['4fr', '6fr'],
        '50-50': ['1fr', '1fr'],
        '60-40': ['6fr', '4fr'],
    };
    const [imgFr, textFr] = ratioMap[ratio] || ['4fr', '6fr'];

    const gridTemplate =
        position === 'image-left'
            ? `${imgFr} ${textFr}`
            : `${textFr} ${imgFr}`;

    const alignMap: Record<string, string> = {
        top: 'items-start',
        center: 'items-center',
        bottom: 'items-end',
    };

    const shapeClass =
        shape === 'rounded'
            ? 'rounded-2xl'
            : shape === 'circle'
              ? 'rounded-full aspect-square object-cover'
              : 'rounded-lg';

    const imageBlock = (
        <div
            className="article-textimage-img cursor-pointer relative group/img"
            onClick={() => setMediaDialogOpen(true)}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || ''}
                    className={cn('w-full h-auto', shapeClass)}
                    draggable={false}
                />
            ) : (
                <div
                    className={cn(
                        'w-full aspect-video bg-muted/40 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center',
                        shapeClass,
                    )}
                >
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-40" />
                        <span className="text-xs">Click to add image</span>
                    </div>
                </div>
            )}
            {src && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Replace className="h-5 w-5 text-white" />
                </div>
            )}
        </div>
    );

    const textBlock = (
        <div className="article-textimage-text">
            <textarea
                value={text}
                onChange={(e) => handleUpdate({ text: e.target.value })}
                placeholder="Write your text here…"
                className="w-full bg-transparent border border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 rounded-lg p-4 min-h-[120px] resize-y text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
        </div>
    );

    return (
        <NodeViewWrapper
            className={cn(
                'article-textimage-block my-6',
                selected && 'ring-2 ring-blue-500 ring-offset-2 rounded-lg',
            )}
        >
            {/* Toolbar */}
            {selected && (
                <div className="article-image-toolbar mb-3" contentEditable={false}>
                    <div className="toolbar-group">
                        <span className="toolbar-label">Position</span>
                        <div className="toolbar-buttons">
                            {TEXT_IMAGE_POSITIONS.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    className={cn('toolbar-btn', position === p.value && 'active')}
                                    onClick={() => handleUpdate({ position: p.value })}
                                    title={p.title}
                                >
                                    <p.icon className="h-3.5 w-3.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="toolbar-group">
                        <span className="toolbar-label">Ratio</span>
                        <div className="toolbar-buttons">
                            {TEXT_IMAGE_RATIOS.map((r) => (
                                <button
                                    key={r.value}
                                    type="button"
                                    className={cn('toolbar-btn text-[10px]', ratio === r.value && 'active')}
                                    onClick={() => handleUpdate({ ratio: r.value })}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="toolbar-group">
                        <span className="toolbar-label">Align</span>
                        <div className="toolbar-buttons">
                            {TEXT_IMAGE_VALIGNS.map((v) => (
                                <button
                                    key={v.value}
                                    type="button"
                                    className={cn('toolbar-btn', valign === v.value && 'active')}
                                    onClick={() => handleUpdate({ valign: v.value })}
                                    title={v.title}
                                >
                                    <v.icon className="h-3.5 w-3.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="toolbar-group">
                        <span className="toolbar-label">Shape</span>
                        <div className="toolbar-buttons">
                            {TEXT_IMAGE_SHAPES.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    className={cn('toolbar-btn', shape === s.value && 'active')}
                                    onClick={() => handleUpdate({ shape: s.value })}
                                    title={s.title}
                                >
                                    <s.icon className="h-3.5 w-3.5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Content grid */}
            <div
                className={cn('grid gap-6', alignMap[valign] || 'items-center')}
                style={{ gridTemplateColumns: gridTemplate }}
            >
                {position === 'image-left' ? (
                    <>
                        {imageBlock}
                        {textBlock}
                    </>
                ) : (
                    <>
                        {textBlock}
                        {imageBlock}
                    </>
                )}
            </div>

            {/* Media library dialog */}
            <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Select Image</DialogTitle>
                    </DialogHeader>
                    <MediaLibrary
                        type="image"
                        onSelect={(asset) => {
                            handleUpdate({ src: asset.url });
                            setMediaDialogOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </NodeViewWrapper>
    );
}

/* ------------------------------------------------------------------ */
/*  Extension definition                                               */
/* ------------------------------------------------------------------ */

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        textImage: {
            setTextImage: (options?: {
                src?: string;
                position?: string;
                ratio?: string;
                valign?: string;
                shape?: string;
            }) => ReturnType;
        };
    }
}

export const TextImageExtension = Node.create({
    name: 'textImage',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {
            src: { default: '' },
            alt: { default: '' },
            position: { default: 'image-left' },
            ratio: { default: '40-60' },
            valign: { default: 'center' },
            shape: { default: 'none' },
            text: { default: '' },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="text-image"]' }];
    },

    renderHTML({ node }) {
        const { src, alt, position, ratio, valign, shape, text } = node.attrs;

        const shapeClass =
            shape === 'rounded'
                ? 'article-img-rounded'
                : shape === 'circle'
                  ? 'article-img-circle'
                  : '';

        return [
            'div',
            {
                'data-type': 'text-image',
                'data-position': position,
                'data-ratio': ratio,
                'data-valign': valign,
                'data-shape': shape,
                class: `article-textimage article-textimage-${position} article-textimage-ratio-${ratio} article-textimage-valign-${valign}`,
            },
            [
                'div',
                { class: `article-textimage-image ${shapeClass}` },
                src ? ['img', { src, alt: alt || '', loading: 'lazy' }] : '',
            ],
            ['div', { class: 'article-textimage-content' }, text || ''],
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(TextImageView);
    },

    addCommands() {
        return {
            setTextImage:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            src: options?.src || '',
                            position: options?.position || 'image-left',
                            ratio: options?.ratio || '40-60',
                            valign: options?.valign || 'center',
                            shape: options?.shape || 'none',
                            text: '',
                        },
                    });
                },
        };
    },
});

export default TextImageExtension;
