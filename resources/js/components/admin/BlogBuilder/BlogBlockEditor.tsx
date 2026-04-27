import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Plus, 
    Trash, 
    ImageIcon, 
    Type, 
    Video, 
    Layers,
    Code,
    Quote,
    Columns,
    Settings2,
    AlignLeft,
    AlignCenter,
    AlignRight
} from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { MediaAsset } from '@/types';
import { Block } from '@/Pages/admin/insights/Form';

interface BlogBlockEditorProps {
    block: Block;
    onUpdate: (content: Record<string, unknown>) => void;
}

interface Column {
    id: string;
    type: 'text' | 'image' | 'video';
    content: Record<string, unknown>;
}

export default function BlogBlockEditor({ block, onUpdate }: BlogBlockEditorProps) {
    const updateContent = (updates: Record<string, unknown>) => {
        onUpdate({ ...block.content, ...updates });
    };

    const columns = (block.content.columns as Column[]) || [];

    const addColumn = (type: 'text' | 'image' | 'video' = 'text') => {
        const newCol: Column = {
            id: 'col-' + Math.random().toString(36).substr(2, 9),
            type,
            content: type === 'text' ? { body: '', textSize: 'base', textAlign: 'left' } : { url: '', alt: '' }
        };
        updateContent({ columns: [...columns, newCol] });
    };

    const updateColumn = (index: number, colUpdates: Record<string, unknown>) => {
        const n = [...columns];
        n[index] = { ...n[index], content: { ...n[index].content, ...colUpdates } };
        updateContent({ columns: n });
    };

    const removeColumn = (index: number) => {
        updateContent({ columns: columns.filter((_, i) => i !== index) });
    };

    // Render based on block type
    switch (block.type) {
        case 'text':
            return (
                <div className="space-y-8">
                    <div className="space-y-3 p-4 rounded-xl border bg-muted/5">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Layout Configuration</Label>
                            <Columns className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <Select 
                            value={String(block.content.layout || '1')} 
                            onValueChange={(val) => updateContent({ layout: val })}
                        >
                            <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Select Layout" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Single Column (Full Width)</SelectItem>
                                <SelectItem value="1-1">Two Columns (Equal)</SelectItem>
                                <SelectItem value="1-1-1">Three Columns (Equal)</SelectItem>
                                <SelectItem value="2-1">Two Columns (66/33)</SelectItem>
                                <SelectItem value="1-2">Two Columns (33/66)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold uppercase tracking-wider">Content Blocks</Label>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => addColumn('text')} className="h-7 px-2 text-[10px]">
                                    <Type className="h-3 w-3 mr-1" /> Add Text
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => addColumn('image')} className="h-7 px-2 text-[10px]">
                                    <ImageIcon className="h-3 w-3 mr-1" /> Add Image
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {columns.map((col, i) => (
                                <div key={col.id || i} className="group relative p-5 border rounded-2xl bg-card shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-muted text-muted-foreground">
                                                {col.type === 'text' ? <Type className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                                {col.type === 'text' ? 'Rich Text Editor' : 'Image Section'}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10" onClick={() => removeColumn(i)}>
                                            <Trash className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    
                                    {col.type === 'text' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Select 
                                                    value={String((col.content as any).textSize || 'base')} 
                                                    onValueChange={(val) => updateColumn(i, { textSize: val })}
                                                >
                                                    <SelectTrigger className="h-8 text-xs w-[120px]"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sm">Small</SelectItem>
                                                        <SelectItem value="base">Standard</SelectItem>
                                                        <SelectItem value="lg">Editorial</SelectItem>
                                                        <SelectItem value="xl">Lead Text</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <div className="flex border rounded-md p-0.5 bg-muted/20">
                                                    {(['left', 'center', 'right'] as const).map((align) => (
                                                        <Button
                                                            key={align}
                                                            variant="ghost"
                                                            size="icon"
                                                            className={`h-7 w-7 ${ (col.content as any).textAlign === align ? 'bg-background shadow-sm text-agency-accent' : 'text-muted-foreground'}`}
                                                            onClick={() => updateColumn(i, { textAlign: align })}
                                                        >
                                                            {align === 'left' ? <AlignLeft className="h-3.5 w-3.5" /> : align === 'center' ? <AlignCenter className="h-3.5 w-3.5" /> : <AlignRight className="h-3.5 w-3.5" />}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="min-h-[250px] border rounded-xl bg-background overflow-hidden focus-within:ring-2 ring-agency-accent/20 transition-all">
                                                <RichTextEditor 
                                                    content={String((col.content as any).body || '')} 
                                                    onChange={(val) => updateColumn(i, { body: val })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {col.type === 'image' && (
                                        <div className="space-y-4">
                                            <MediaLibrary 
                                                onSelect={(asset: MediaAsset) => updateColumn(i, { url: asset.url })}
                                                trigger={
                                                    <div className="aspect-video rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-agency-accent/5 hover:border-agency-accent/30 transition-all overflow-hidden group">
                                                        {(col.content as any).url ? (
                                                            <img src={String((col.content as any).url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                                        ) : (
                                                            <>
                                                                <ImageIcon className="h-8 w-8 mb-2 opacity-10" />
                                                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Select Visual</span>
                                                            </>
                                                        )}
                                                    </div>
                                                }
                                            />
                                            <div className="grid gap-3">
                                                <Input className="h-9 text-xs rounded-lg" value={String((col.content as any).alt || '')} onChange={(e) => updateColumn(i, { alt: e.target.value })} placeholder="Accessibility description (Alt text)" />
                                                <Input className="h-9 text-xs rounded-lg" value={String((col.content as any).caption || '')} onChange={(e) => updateColumn(i, { caption: e.target.value })} placeholder="Write a caption..." />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 'image':
            return (
                <div className="space-y-6">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Main Visual</Label>
                    <MediaLibrary 
                        onSelect={(asset: MediaAsset) => updateContent({ url: asset.url })}
                        trigger={
                            <div className="aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-agency-accent/5 hover:border-agency-accent/30 transition-all overflow-hidden group">
                                {block.content.url ? (
                                    <img src={String(block.content.url)} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <>
                                        <ImageIcon className="h-10 w-10 mb-2 opacity-10" />
                                        <span className="text-xs uppercase tracking-widest font-bold opacity-30">Choose Image</span>
                                    </>
                                )}
                            </div>
                        }
                    />
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Alt Text</Label>
                            <Input value={String(block.content.alt || '')} onChange={(e) => updateContent({ alt: e.target.value })} placeholder="Describe the image..." />
                        </div>
                        <div className="grid gap-2">
                            <Label>Caption</Label>
                            <Textarea value={String(block.content.caption || '')} onChange={(e) => updateContent({ caption: e.target.value })} placeholder="Image caption..." />
                        </div>
                    </div>
                </div>
            );

        case 'video':
            return (
                <div className="space-y-6">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Video Configuration</Label>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Video URL</Label>
                            <Input 
                                value={String(block.content.url || '')} 
                                onChange={(e) => updateContent({ url: e.target.value })} 
                                placeholder="YouTube, Vimeo, or MP4 link..." 
                            />
                        </div>
                        <div className="p-4 rounded-xl border bg-muted/5">
                           <p className="text-[10px] text-muted-foreground leading-relaxed">
                                Tip: You can use direct links to MP4 files or standard YouTube/Vimeo URLs. The player will automatically adapt.
                           </p>
                        </div>
                    </div>
                </div>
            );

        case 'quote_block':
            return (
                <div className="space-y-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Quote Text</Label>
                            <Textarea 
                                className="h-32 text-lg italic font-serif"
                                value={String(block.content.text || '')} 
                                onChange={(e) => updateContent({ text: e.target.value })} 
                                placeholder="Enter the inspiring quote..." 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Author / Source</Label>
                            <Input 
                                value={String(block.content.author || '')} 
                                onChange={(e) => updateContent({ author: e.target.value })} 
                                placeholder="e.g. Steve Jobs" 
                            />
                        </div>
                    </div>
                </div>
            );

        case 'code_snippet':
            return (
                <div className="space-y-6">
                    <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                            <Label>Language</Label>
                            <Select 
                                value={String(block.content.language || 'javascript')} 
                                onValueChange={(val) => updateContent({ language: val })}
                            >
                                <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="javascript">JavaScript</SelectItem>
                                    <SelectItem value="typescript">TypeScript</SelectItem>
                                    <SelectItem value="php">PHP</SelectItem>
                                    <SelectItem value="css">CSS</SelectItem>
                                    <SelectItem value="html">HTML</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Code Content</Label>
                            <Textarea 
                                className="h-64 font-mono text-xs bg-slate-950 text-slate-50 p-4 rounded-xl"
                                value={String(block.content.code || '')} 
                                onChange={(e) => updateContent({ code: e.target.value })} 
                                placeholder="// Paste your code here..." 
                            />
                        </div>
                    </div>
                </div>
            );

        case 'insights':
            return (
                <div className="space-y-6">
                    <div className="grid gap-2">
                        <Label>Section Title</Label>
                        <Input value={String(block.content.title || 'Related Reading')} onChange={(e) => updateContent({ title: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Number of Posts</Label>
                        <Select 
                            value={String(block.content.limit || '3')} 
                            onValueChange={(val) => updateContent({ limit: parseInt(val) })}
                        >
                            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2 Posts</SelectItem>
                                <SelectItem value="3">3 Posts</SelectItem>
                                <SelectItem value="4">4 Posts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            );

        default:
            return (
                <div className="p-8 border-2 border-dashed rounded-2xl text-center">
                    <Settings2 className="h-8 w-8 mx-auto mb-3 opacity-10" />
                    <p className="text-sm font-semibold opacity-40">Editor not available</p>
                    <p className="text-[10px] opacity-30 mt-1">This block type doesn't have a specialized blog editor yet.</p>
                </div>
            );
    }
}
