import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    Strikethrough, 
    Code, 
    Heading1, 
    Heading2, 
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    Save,
    AlertCircle,
    CheckCircle,
    MousePointerClick,
    Columns2,
    LayoutPanelLeft,
    SeparatorHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import MediaLibrary from './MediaLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    WordCountPlugin, 
    AutoSavePlugin, 
    ContentValidationPlugin, 
    FocusModePlugin,
    TableOfContentsPlugin 
} from './editor/EditorPlugins';
import { ButtonExtension } from './editor/ButtonExtension';
import { ResizableImageExtension } from './editor/ResizableImageExtension';
import { ColumnLayoutNode, ColumnNode } from './editor/ColumnLayoutExtension';
import { TextImageExtension } from './editor/TextImageExtension';
import { DividerExtension } from './editor/DividerExtension';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ToolbarButton component - defined outside to prevent recreation during render
interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}

const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children, 
    title 
}: ToolbarButtonProps) => (
    <Button
        type="button"
        variant={isActive ? "default" : "ghost"}
        size="sm"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "h-8 w-8 p-0",
            isActive && "bg-agency-accent text-agency-primary"
        )}
    >
        {children}
    </Button>
);

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    limit?: number;
    editable?: boolean;
    onSave?: (content: string) => void;
    autoSave?: boolean;
    showWordCount?: boolean;
    showTableOfContents?: boolean;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = 'Start writing...',
    className,
    limit = 500000,
    editable = true,
    onSave,
    autoSave = false,
    showWordCount = true,
    showTableOfContents = false
}: RichTextEditorProps) {
    const [linkUrl, setLinkUrl] = React.useState('');
    const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
    const [mediaDialogOpen, setMediaDialogOpen] = React.useState(false);
    const [buttonDialogOpen, setButtonDialogOpen] = React.useState(false);
    const [buttonText, setButtonText] = React.useState('Click Here');
    const [buttonUrl, setButtonUrl] = React.useState('');
    const [buttonStyle, setButtonStyle] = React.useState('primary');
    const [buttonAlign, setButtonAlign] = React.useState('left');
    const [focusMode, setFocusMode] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
    const [isValid, setIsValid] = React.useState(true);
    const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);

    // Upload an image file to the server and return its URL
    const uploadImageFile = useCallback(async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('files[]', file);
        formData.append('folder', 'uploads/editor');

        try {
            const response = await axios.post('/admin/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // The MediaController returns { files: [{ url, path, ... }] }
            const files = response.data?.files;
            if (Array.isArray(files) && files.length > 0) {
                return files[0].url || null;
            }
            return null;
        } catch (err) {
            console.error('Editor image upload failed:', err);
            return null;
        }
    }, []);

    // Track images currently being uploaded to prevent duplicate uploads
    const uploadingImages = React.useRef<Set<string>>(new Set());

    // Scan the document for base64 images and upload them
    const uploadBase64Images = useCallback(async (editorInstance: ReturnType<typeof useEditor>) => {
        if (!editorInstance) return;
        const doc = editorInstance.state.doc;
        const base64Nodes: { pos: number; src: string; node: ReturnType<typeof doc.nodeAt> }[] = [];

        doc.descendants((node, pos) => {
            if (node.type.name === 'resizableImage' && node.attrs.src?.startsWith('data:image/')) {
                const src = node.attrs.src as string;
                // Skip if already uploading this image
                if (!uploadingImages.current.has(src.substring(0, 100))) {
                    base64Nodes.push({ pos, src, node });
                }
            }
        });

        if (base64Nodes.length === 0) return;

        setIsUploading(true);

        for (const { src } of base64Nodes) {
            const key = src.substring(0, 100);
            uploadingImages.current.add(key);

            try {
                // Convert base64 to File
                const response = await fetch(src);
                const blob = await response.blob();
                const ext = blob.type.split('/')[1]?.split(';')[0] || 'png';
                const file = new File([blob], `pasted-image-${Date.now()}.${ext}`, { type: blob.type });

                const url = await uploadImageFile(file);
                if (url && editorInstance) {
                    // Find the image node again (positions may have changed)
                    editorInstance.state.doc.descendants((node, pos) => {
                        if (node.type.name === 'resizableImage' && node.attrs.src === src) {
                            const tr = editorInstance.state.tr;
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: url });
                            editorInstance.view.dispatch(tr);
                        }
                    });
                }
            } catch (err) {
                console.error('Failed to upload base64 image:', err);
            } finally {
                uploadingImages.current.delete(key);
            }
        }

        setIsUploading(false);
    }, [uploadImageFile]);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            ResizableImageExtension,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-agency-accent hover:underline',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            CharacterCount.configure({
                limit: null,
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Typography,
            Underline,
            ColumnLayoutNode,
            ColumnNode,
            TextImageExtension,
            DividerExtension,
            WordCountPlugin,
            AutoSavePlugin.configure({
                delay: 2000,
                onSave: (content: string) => {
                    if (autoSave && onSave) {
                        onSave(content);
                        setLastSaved(new Date());
                    }
                },
            }),
            ContentValidationPlugin.configure({
                maxLength: limit,
                onValidationChange: (valid: boolean, errors: string[]) => {
                    setIsValid(valid);
                    setValidationErrors(errors);
                },
            }),
            FocusModePlugin.configure({
                enabled: focusMode,
            }),
            TableOfContentsPlugin,
            ButtonExtension,
        ],
        content,
        editable,
        onUpdate: ({ editor: editorInstance }) => {
            onChange(editorInstance.getHTML());
            // After any content update, scan for base64 images and upload them
            // Use a small delay to batch multiple image pastes
            setTimeout(() => uploadBase64Images(editorInstance), 500);
        },
        editorProps: {
            handlePaste: (_view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                // Only intercept if it's a pure image paste (no text/html)
                const hasHtml = Array.from(items).some(item => item.type === 'text/html');
                if (hasHtml) {
                    // Let Tiptap handle the HTML paste normally - 
                    // the onUpdate handler will catch and upload any base64 images
                    return false;
                }

                for (const item of Array.from(items)) {
                    if (item.type.startsWith('image/')) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                            uploadImageFile(file).then((url) => {
                                if (url && editor) {
                                    editor.chain().focus().setResizableImage({ src: url }).run();
                                }
                            });
                        }
                        return true;
                    }
                }
                return false;
            },
            handleDrop: (_view, event, _slice, moved) => {
                if (moved) return false;
                const files = event.dataTransfer?.files;
                if (!files || files.length === 0) return false;

                for (const file of Array.from(files)) {
                    if (file.type.startsWith('image/')) {
                        event.preventDefault();
                        uploadImageFile(file).then((url) => {
                            if (url && editor) {
                                editor.chain().focus().setResizableImage({ src: url }).run();
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            const focusModeExt = editor.extensionManager.extensions.find(ext => ext.name === 'focusMode');
            if (focusModeExt && focusModeExt.options) {
                focusModeExt.options.enabled = focusMode;
            }
        }
    }, [focusMode, editor]);

    const addImage = useCallback((url: string) => {
        if (editor) {
            editor.chain().focus().setResizableImage({ src: url }).run();
        }
    }, [editor]);

    const addButton = useCallback(() => {
        if (editor && buttonText) {
            editor.chain().focus().setButton({ 
                text: buttonText, 
                href: buttonUrl || '#', 
                style: buttonStyle,
                align: buttonAlign
            }).run();
            setButtonText('Click Here');
            setButtonUrl('');
            setButtonStyle('primary');
            setButtonAlign('left');
            setButtonDialogOpen(false);
        }
    }, [editor, buttonText, buttonUrl, buttonStyle, buttonAlign]);

    const setLink = useCallback(() => {
        if (editor && linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setLinkDialogOpen(false);
        }
    }, [editor, linkUrl]);
    const unsetLink = useCallback(() => {
        if (editor) {
            editor.chain().focus().unsetLink().run();
        }
    }, [editor]);

    const getWordCount = () => {
        return (editor?.storage as any)?.wordCount?.words || 0;
    };

    const getReadingTime = () => {
        return (editor?.storage as any)?.wordCount?.readingTime || 0;
    };

    const getTableOfContents = () => {
        return (editor?.storage as any)?.tableOfContents?.headings || [];
    };

    const manualSave = useCallback(() => {
        if (onSave && editor) {
            onSave(editor.getHTML());
            setLastSaved(new Date());
        }
    }, [onSave, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={cn("border rounded-lg overflow-hidden", className)}>
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <Alert variant="destructive" className="m-4 mb-0">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <ul className="list-disc list-inside">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Enhanced Toolbar */}
            <div className="border-b bg-muted/30 p-2">
                <div className="flex flex-wrap items-center gap-1 mb-2">
                    {/* Save and Status */}
                    {onSave && (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={manualSave}
                                className="gap-2"
                            >
                                <Save className="h-4 w-4" />
                                Save
                            </Button>
                            {lastSaved && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                            <Separator orientation="vertical" className="h-6 mx-1" />
                        </>
                    )}

                    {/* Focus Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <Label htmlFor="focus-mode" className="text-xs">Focus Mode</Label>
                        <Switch
                            id="focus-mode"
                            checked={focusMode}
                            onCheckedChange={setFocusMode}
                        />
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-1" />
                </div>

                <div className="flex flex-wrap items-center gap-1">
                    {/* Text Formatting */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Code"
                    >
                        <Code className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        isActive={editor.isActive('highlight')}
                        title="Highlight"
                    >
                        <Highlighter className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Headings */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Lists */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Alignment */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Justify"
                    >
                        <AlignJustify className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Media & Links */}
                    <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                        <DialogTrigger asChild>
                            <ToolbarButton
                                onClick={() => setLinkDialogOpen(true)}
                                isActive={editor.isActive('link')}
                                title="Add Link"
                            >
                                <LinkIcon className="h-4 w-4" />
                            </ToolbarButton>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Link</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="link-url">URL</Label>
                                    <Input
                                        id="link-url"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://example.com"
                                        onKeyDown={(e) => e.key === 'Enter' && setLink()}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={setLink} disabled={!linkUrl}>
                                        Add Link
                                    </Button>
                                    {editor.isActive('link') && (
                                        <Button variant="outline" onClick={unsetLink}>
                                            Remove Link
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
                        <DialogTrigger asChild>
                            <ToolbarButton
                                onClick={() => setMediaDialogOpen(true)}
                                title="Add Image"
                            >
                                <ImageIcon className="h-4 w-4" />
                            </ToolbarButton>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Select Image</DialogTitle>
                            </DialogHeader>
                            <MediaLibrary
                                type="image"
                                onSelect={(asset) => {
                                    addImage(asset.url);
                                    setMediaDialogOpen(false);
                                }}
                            />
                        </DialogContent>
                    </Dialog>

                    {/* Button Dialog */}
                    <Dialog open={buttonDialogOpen} onOpenChange={setButtonDialogOpen}>
                        <DialogTrigger asChild>
                            <ToolbarButton
                                onClick={() => setButtonDialogOpen(true)}
                                title="Add Button"
                            >
                                <MousePointerClick className="h-4 w-4" />
                            </ToolbarButton>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Button</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="button-text">Button Text</Label>
                                    <Input
                                        id="button-text"
                                        value={buttonText}
                                        onChange={(e) => setButtonText(e.target.value)}
                                        placeholder="Click Here"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="button-url">Link URL</Label>
                                    <Input
                                        id="button-url"
                                        value={buttonUrl}
                                        onChange={(e) => setButtonUrl(e.target.value)}
                                        placeholder="https://example.com or /page-slug"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="button-style">Style</Label>
                                    <Select value={buttonStyle} onValueChange={setButtonStyle}>
                                        <SelectTrigger className="w-full mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primary">Primary (Filled)</SelectItem>
                                            <SelectItem value="secondary">Secondary (Subtle)</SelectItem>
                                            <SelectItem value="outline">Outline</SelectItem>
                                            <SelectItem value="ghost">Ghost (Text only)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Alignment</Label>
                                    <div className="flex gap-1 mt-1">
                                        <Button
                                            type="button"
                                            variant={buttonAlign === 'left' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setButtonAlign('left')}
                                            className="h-9 w-9 p-0"
                                        >
                                            <AlignLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={buttonAlign === 'center' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setButtonAlign('center')}
                                            className="h-9 w-9 p-0"
                                        >
                                            <AlignCenter className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={buttonAlign === 'right' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setButtonAlign('right')}
                                            className="h-9 w-9 p-0"
                                        >
                                            <AlignRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Button onClick={addButton} disabled={!buttonText}>
                                    Insert Button
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Layout Blocks */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setColumnLayout({ layout: '1-1' }).run()}
                        title="Column Layout"
                    >
                        <Columns2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextImage().run()}
                        title="Text + Image Block"
                    >
                        <LayoutPanelLeft className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setDivider().run()}
                        title="Divider"
                    >
                        <SeparatorHorizontal className="h-4 w-4" />
                    </ToolbarButton>

                    <Separator orientation="vertical" className="h-6 mx-1" />

                    {/* Undo/Redo */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Enhanced Editor Content */}
            <div className="relative">
                <div className="flex">
                    {/* Table of Contents Sidebar */}
                    {showTableOfContents && getTableOfContents().length > 0 && (
                        <div className="w-64 border-r bg-muted/20 p-4 max-h-96 overflow-y-auto">
                            <h4 className="font-semibold text-sm mb-3">Table of Contents</h4>
                            <nav className="space-y-1">
                                {getTableOfContents().map((heading: any, index: number) => (
                                    <button
                                        key={index}
                                        className={cn(
                                            "block text-left text-xs hover:text-agency-accent transition-colors w-full",
                                            `pl-${(heading.level - 1) * 3}`
                                        )}
                                        onClick={() => {
                                            editor?.commands.focus(heading.pos);
                                        }}
                                    >
                                        {heading.text}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}

                    {/* Main Editor */}
                    <div className="flex-1 relative">
                        {isUploading && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center rounded">
                                <div className="flex items-center gap-2 bg-background border rounded-lg px-4 py-2 shadow-sm">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    <span className="text-sm text-muted-foreground">Uploading image…</span>
                                </div>
                            </div>
                        )}
                        <EditorContent 
                            editor={editor} 
                            className={cn(
                                "prose prose-base dark:prose-invert max-w-none p-4 min-h-[300px] focus-within:outline-none",
                                "prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
                                "prose-p:my-2 prose-ul:my-2 prose-ol:my-2",
                                focusMode && "focus-mode"
                            )}
                        />
                    </div>
                </div>
                
                {/* Editor content without bubble/floating menus for now */}
            </div>

            {/* Enhanced Footer with statistics */}
            <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <span>
                            {editor?.storage.characterCount.characters()}/{limit} characters
                        </span>
                        {showWordCount && (
                            <>
                                <span>
                                    {getWordCount()} words
                                </span>
                                <span>
                                    ~{getReadingTime()} min read
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isValid ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                Valid
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}