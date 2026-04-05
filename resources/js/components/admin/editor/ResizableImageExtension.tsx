import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import React, { useState, useCallback } from 'react';
import {
    Maximize2,
    Minimize2,
    Square,
    Circle,
    RectangleHorizontal,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Type,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MediaLibrary from '../MediaLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/* ------------------------------------------------------------------ */
/*  Size / Shape / Float options                                       */
/* ------------------------------------------------------------------ */

export const IMAGE_SIZES = [
    { value: 'small', label: 'S', pct: '25%', title: 'Small (25%)' },
    { value: 'medium', label: 'M', pct: '50%', title: 'Medium (50%)' },
    { value: 'large', label: 'L', pct: '75%', title: 'Large (75%)' },
    { value: 'full', label: 'Full', pct: '100%', title: 'Full width' },
] as const;

export const IMAGE_SHAPES = [
    { value: 'none', icon: Square, title: 'No frame' },
    { value: 'rounded', icon: RectangleHorizontal, title: 'Rounded' },
    { value: 'circle', icon: Circle, title: 'Circle' },
] as const;

export const IMAGE_FLOATS = [
    { value: 'none', icon: AlignCenter, title: 'No float' },
    { value: 'left', icon: AlignLeft, title: 'Float left' },
    { value: 'right', icon: AlignRight, title: 'Float right' },
] as const;

/* ------------------------------------------------------------------ */
/*  Floating toolbar that appears when image is selected               */
/* ------------------------------------------------------------------ */

interface ImageToolbarProps {
    size: string;
    shape: string;
    float: string;
    caption: string;
    alt: string;
    onUpdate: (attrs: Record<string, string>) => void;
}

function ImageToolbar({ size, shape, float: imgFloat, caption, alt, onUpdate }: ImageToolbarProps) {
    const [showCaptionInput, setShowCaptionInput] = useState(!!caption);
    const [showAltInput, setShowAltInput] = useState(false);

    return (
        <div className="article-image-toolbar" contentEditable={false}>
            {/* Size presets */}
            <div className="toolbar-group">
                <span className="toolbar-label">Size</span>
                <div className="toolbar-buttons">
                    {IMAGE_SIZES.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            className={cn('toolbar-btn', size === s.value && 'active')}
                            onClick={() => onUpdate({ size: s.value })}
                            title={s.title}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Shape */}
            <div className="toolbar-group">
                <span className="toolbar-label">Shape</span>
                <div className="toolbar-buttons">
                    {IMAGE_SHAPES.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            className={cn('toolbar-btn', shape === s.value && 'active')}
                            onClick={() => onUpdate({ shape: s.value })}
                            title={s.title}
                        >
                            <s.icon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Float */}
            <div className="toolbar-group">
                <span className="toolbar-label">Float</span>
                <div className="toolbar-buttons">
                    {IMAGE_FLOATS.map((f) => (
                        <button
                            key={f.value}
                            type="button"
                            className={cn('toolbar-btn', imgFloat === f.value && 'active')}
                            onClick={() => onUpdate({ float: f.value })}
                            title={f.title}
                        >
                            <f.icon className="h-3.5 w-3.5" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Caption & Alt toggles */}
            <div className="toolbar-group">
                <button
                    type="button"
                    className={cn('toolbar-btn', showCaptionInput && 'active')}
                    onClick={() => setShowCaptionInput(!showCaptionInput)}
                    title="Caption"
                >
                    <Type className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Caption input */}
            {showCaptionInput && (
                <div className="toolbar-input-row">
                    <input
                        type="text"
                        value={caption}
                        onChange={(e) => onUpdate({ caption: e.target.value })}
                        placeholder="Image caption…"
                        className="toolbar-input"
                    />
                </div>
            )}

            {/* Alt text input */}
            {showAltInput && (
                <div className="toolbar-input-row">
                    <input
                        type="text"
                        value={alt}
                        onChange={(e) => onUpdate({ alt: e.target.value })}
                        placeholder="Alt text for accessibility…"
                        className="toolbar-input"
                    />
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  React NodeView component                                           */
/* ------------------------------------------------------------------ */

function ResizableImageView(props: NodeViewProps) {
    const { node, updateAttributes, selected } = props;
    const { src, alt, size, shape, float: imgFloat, caption } = node.attrs;

    const handleUpdate = useCallback(
        (attrs: Record<string, string>) => {
            updateAttributes(attrs);
        },
        [updateAttributes],
    );

    // Build wrapper classes for the editor view
    const sizeMap: Record<string, string> = {
        small: '25%',
        medium: '50%',
        large: '75%',
        full: '100%',
    };

    const shapeClass =
        shape === 'rounded'
            ? 'rounded-2xl'
            : shape === 'circle'
              ? 'rounded-full aspect-square object-cover'
              : '';

    const floatClass =
        imgFloat === 'left'
            ? 'editor-img-float-left'
            : imgFloat === 'right'
              ? 'editor-img-float-right'
              : '';

    const wrapperStyle: React.CSSProperties = {
        width: sizeMap[size] || '100%',
        margin: imgFloat === 'none' || !imgFloat ? '0 auto' : undefined,
    };

    return (
        <NodeViewWrapper
            className={cn('article-resizable-image', floatClass, selected && 'ring-2 ring-blue-500 ring-offset-2')}
            style={wrapperStyle}
        >
            <figure className="m-0">
                <img
                    src={src}
                    alt={alt || ''}
                    className={cn('w-full h-auto', shapeClass)}
                    draggable={false}
                />
                {caption && (
                    <figcaption className="text-sm text-center text-muted-foreground mt-2 italic">
                        {caption}
                    </figcaption>
                )}
            </figure>

            {selected && (
                <ImageToolbar
                    size={size}
                    shape={shape}
                    float={imgFloat}
                    caption={caption}
                    alt={alt}
                    onUpdate={handleUpdate}
                />
            )}
        </NodeViewWrapper>
    );
}

/* ------------------------------------------------------------------ */
/*  Tiptap Extension definition                                        */
/* ------------------------------------------------------------------ */

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        resizableImage: {
            setResizableImage: (options: {
                src: string;
                alt?: string;
                size?: string;
                shape?: string;
                float?: string;
                caption?: string;
            }) => ReturnType;
        };
    }
}

export const ResizableImageExtension = Node.create({
    name: 'resizableImage',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: '' },
            size: { default: 'full' },
            shape: { default: 'none' },
            float: { default: 'none' },
            caption: { default: '' },
        };
    },

    parseHTML() {
        return [
            { tag: 'figure[data-type="resizable-image"]' },
            // Also parse plain <img> tags
            {
                tag: 'img[src]',
                getAttrs: (dom) => {
                    const el = dom as HTMLElement;
                    return {
                        src: el.getAttribute('src'),
                        alt: el.getAttribute('alt') || '',
                    };
                },
            },
        ];
    },

    renderHTML({ node }) {
        const { src, alt, size, shape, float: imgFloat, caption } = node.attrs;

        const shapeClass =
            shape === 'rounded'
                ? 'article-img-rounded'
                : shape === 'circle'
                  ? 'article-img-circle'
                  : '';

        const floatClass =
            imgFloat === 'left'
                ? 'article-img-float-left'
                : imgFloat === 'right'
                  ? 'article-img-float-right'
                  : '';

        const figureAttrs = {
            'data-type': 'resizable-image',
            'data-size': size,
            'data-shape': shape,
            'data-float': imgFloat,
            class: `article-img article-img-${size} ${shapeClass} ${floatClass}`.trim(),
        };

        const imgAttrs = {
            src,
            alt: alt || '',
            loading: 'lazy' as const,
        };

        if (caption) {
            return [
                'figure',
                figureAttrs,
                ['img', imgAttrs],
                ['figcaption', {}, caption],
            ];
        }

        return ['figure', figureAttrs, ['img', imgAttrs]];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageView);
    },

    addCommands() {
        return {
            setResizableImage:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            src: options.src,
                            alt: options.alt || '',
                            size: options.size || 'full',
                            shape: options.shape || 'none',
                            float: options.float || 'none',
                            caption: options.caption || '',
                        },
                    });
                },
        };
    },
});

export default ResizableImageExtension;
