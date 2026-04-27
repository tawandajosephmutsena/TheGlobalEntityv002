import React, { useState, useCallback } from 'react';
import { Block, BlockType } from '@/pages/admin/insights/Form';
import BlogBlockList from './BlogBlockList';
import VisualPreview from '../PageBuilder/VisualPreview';
import { Layers, Eye, Edit3, Settings2, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

interface BlogArticleBuilderProps {
    blocks: Block[];
    setBlocks: (blocks: Block[] | ((prev: Block[]) => Block[])) => void;
    onUpdateBlock: (id: string, content: Record<string, unknown>) => void;
    onAddBlock: (type: BlockType) => void;
    onRemoveBlock: (id: string) => void;
    onDuplicateBlock: (id: string) => void;
    onToggleBlock: (id: string) => void;
    pageTitle: string;
    pageSlug: string;
    previewBaseUrl?: string;
    isProcessing?: boolean;
    onSave?: () => void;
    isEdit?: boolean;
}

export default function BlogArticleBuilder({
    blocks,
    setBlocks,
    onUpdateBlock,
    onAddBlock,
    onRemoveBlock,
    onDuplicateBlock,
    onToggleBlock,
    pageTitle,
    pageSlug,
    previewBaseUrl = '/blog',
    isProcessing = false,
    onSave,
    isEdit = false
}: BlogArticleBuilderProps) {
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

    // Handle block selection
    const handleSelectBlock = useCallback((id: string | null) => {
        setActiveBlockId(id);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[700px] bg-background border rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
            {/* Header / Mode Switcher */}
            <div className="h-14 border-b bg-muted/5 flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-agency-accent/10 text-agency-accent">
                        <Edit3 className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-sm tracking-tight uppercase">Article Builder</span>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-[300px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor" className="gap-2">
                            <Layers className="h-4 w-4" />
                            Structure
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Live Preview
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                    {onSave && (
                        <Button 
                            onClick={onSave} 
                            disabled={isProcessing}
                            size="sm"
                            className="bg-agency-accent text-agency-primary hover:bg-agency-accent/90 h-9 px-4 rounded-lg font-bold transition-all shadow-sm active:scale-95"
                        >
                            {isProcessing ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            {isEdit ? 'Update Article' : 'Publish Article'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Editor Mode: Sidebar + Preview */}
                <div 
                    className={cn(
                        "flex-1 flex overflow-hidden transition-all duration-300",
                        activeTab === 'preview' && "translate-x-0"
                    )}
                >
                    {/* Sidebar: Only show in editor mode OR as overlay? Actually let's hide it if preview active */}
                    <div className={cn(
                        "border-r flex flex-col bg-muted/5 transition-all duration-300 overflow-hidden min-h-0",
                        activeTab === 'editor' ? "w-full lg:w-[400px]" : "w-0 border-r-0"
                    )}>
                        <BlogBlockList 
                            blocks={blocks}
                            activeBlockId={activeBlockId}
                            onSelectBlock={handleSelectBlock}
                            onAddBlock={onAddBlock}
                            onRemoveBlock={onRemoveBlock}
                            onDuplicateBlock={onDuplicateBlock}
                            onToggleBlock={onToggleBlock}
                            onUpdateBlock={onUpdateBlock}
                            setBlocks={setBlocks}
                        />
                    </div>

                    {/* Preview Area: Expands when sidebar is hidden */}
                    <div className={cn(
                        "flex-1 bg-muted/20 relative flex flex-col overflow-hidden transition-all duration-300",
                        activeTab === 'editor' ? "hidden lg:flex" : "flex"
                    )}>
                        <div className="w-full h-full bg-background overflow-hidden">
                            <VisualPreview 
                                blocks={blocks}
                                pageTitle={pageTitle}
                                pageSlug={pageSlug}
                                previewBaseUrl={previewBaseUrl}
                                isFullscreen={activeTab === 'preview'}
                                onToggleFullscreen={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
