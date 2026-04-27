import React, { useState, useCallback } from 'react';
import { Block, BlockType } from '@/Pages/admin/insights/Form';
import BlogBlockList from './BlogBlockList';
import VisualPreview from '../PageBuilder/VisualPreview';
import { Layers, Eye, Edit3, Settings2, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="flex flex-col h-[800px] bg-background border rounded-2xl overflow-hidden shadow-sm">
            {/* Header / Mode Switcher */}
            <div className="h-14 border-b bg-muted/5 flex items-center justify-between px-6">
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

            <div className="flex-1 flex overflow-hidden">
                {/* Always show the Block List/Editor in Editor Tab */}
                <div 
                    className={`flex-1 flex overflow-hidden ${activeTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}
                >
                    <div className="w-full lg:w-[450px] border-r flex flex-col bg-muted/5">
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

                    {/* In Desktop, show a smaller preview next to editor, or hide if preview tab is active */}
                    <div className="hidden lg:flex flex-1 bg-muted/20 relative items-center justify-center p-8 overflow-hidden">
                        <div className="w-full max-w-4xl h-full shadow-2xl rounded-xl overflow-hidden bg-background border ring-1 ring-black/5">
                            <VisualPreview 
                                blocks={blocks}
                                pageTitle={pageTitle}
                                pageSlug={pageSlug}
                                previewBaseUrl={previewBaseUrl}
                                isFullscreen={false}
                                onToggleFullscreen={() => setActiveTab('preview')}
                            />
                        </div>
                    </div>
                </div>

                {/* Fullscreen Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="flex-1 bg-background relative flex flex-col overflow-hidden lg:hidden">
                        <VisualPreview 
                            blocks={blocks}
                            pageTitle={pageTitle}
                            pageSlug={pageSlug}
                            previewBaseUrl={previewBaseUrl}
                            isFullscreen={true}
                            onToggleFullscreen={() => setActiveTab('editor')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
