import React from 'react';
import { 
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import { 
    arrayMove, 
    SortableContext, 
    sortableKeyboardCoordinates, 
    verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Block, BlockType } from '@/Pages/admin/insights/Form';
import SortableBlockItem from '../PageBuilder/SortableBlockItem';
import BlogAddBlockMenu from './BlogAddBlockMenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Plus, Settings2, Info } from 'lucide-react';
import BlogBlockEditor from './BlogBlockEditor';

interface BlogBlockListProps {
    blocks: Block[];
    activeBlockId: string | null;
    onSelectBlock: (id: string | null) => void;
    onAddBlock: (type: BlockType) => void;
    onRemoveBlock: (id: string) => void;
    onDuplicateBlock: (id: string) => void;
    onToggleBlock: (id: string) => void;
    onUpdateBlock: (id: string, content: Record<string, any>) => void;
    setBlocks: (blocks: Block[] | ((prev: Block[]) => Block[])) => void;
}

export default function BlogBlockList({
    blocks,
    activeBlockId,
    onSelectBlock,
    onAddBlock,
    onRemoveBlock,
    onDuplicateBlock,
    onToggleBlock,
    onUpdateBlock,
    setBlocks
}: BlogBlockListProps) {
    const activeBlock = blocks.find(b => b.id === activeBlockId);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    if (activeBlockId && activeBlock) {
        return (
            <div className="flex flex-col h-full bg-background overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b flex-shrink-0 bg-muted/5">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full hover:bg-agency-accent/10 hover:text-agency-accent transition-colors" 
                        onClick={() => onSelectBlock(null)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-agency-accent">Editing Section</span>
                        <h3 className="text-xs font-bold truncate uppercase tracking-tighter">
                            {activeBlock.type.replace(/_/g, ' ')}
                        </h3>
                    </div>
                </div>
                <ScrollArea className="flex-1 min-h-0">
                    <div className="p-5">
                        <BlogBlockEditor 
                            block={activeBlock} 
                            onUpdate={(content) => onUpdateBlock(activeBlock.id, content)} 
                        />
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-muted/5">
                   <div className="flex items-center gap-2 text-[10px] text-muted-foreground italic">
                        <Info className="h-3 w-3" />
                        <span>Changes are reflected in the preview instantly.</span>
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-background z-10 flex-shrink-0">
                <div className="flex flex-col">
                    <h2 className="text-base font-bold tracking-tight">Article Sections</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                        {blocks.length} {blocks.length === 1 ? 'Section' : 'Sections'} Added
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            <ScrollArea className="flex-1 min-h-0">
                <div className="p-4">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {blocks.map((block, index) => (
                                    <SortableBlockItem
                                        key={block.id}
                                        block={block}
                                        index={index}
                                        isActive={activeBlockId === block.id}
                                        onSelect={() => onSelectBlock(block.id)}
                                        onRemove={() => onRemoveBlock(block.id)}
                                        onDuplicate={() => onDuplicateBlock(block.id)}
                                        onToggle={() => onToggleBlock(block.id)}
                                    />
                                ))}
                                 {blocks.length === 0 && (
                                    <BlogAddBlockMenu onAddBlock={onAddBlock}>
                                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-muted/10 text-muted-foreground hover:bg-agency-accent/5 hover:border-agency-accent group cursor-pointer transition-all">
                                            <div className="h-12 w-12 rounded-full bg-muted group-hover:bg-agency-accent/10 group-hover:text-agency-accent flex items-center justify-center mb-4 transition-colors">
                                                <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <p className="text-sm font-semibold text-agency-primary/60 group-hover:text-agency-accent transition-colors">Your article is empty</p>
                                            <p className="text-[10px] mt-1 text-center max-w-[180px]">Click here to add your first section and start writing your masterpiece.</p>
                                        </div>
                                    </BlogAddBlockMenu>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </ScrollArea>

            <div className="p-4 border-t mt-auto">
                <BlogAddBlockMenu onAddBlock={onAddBlock} />
            </div>
        </div>
    );
}
