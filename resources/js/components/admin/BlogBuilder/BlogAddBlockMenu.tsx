import React from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
    Plus, 
    Type, 
    ImageIcon, 
    Video, 
    BookOpen, 
    Quote,
    Layers,
    Code,
    MessageSquare,
    Link as LinkIcon
} from 'lucide-react';

import { BlockType } from '@/Pages/admin/insights/Form';

interface BlogAddBlockMenuProps {
    onAddBlock: (type: BlockType) => void;
    children?: React.ReactNode;
}

const BLOG_BLOCKS = [
    {
        name: 'Essential Content',
        icon: <Type className="h-4 w-4" />,
        blocks: [
            { type: 'text', label: 'Rich Text Section', icon: <Type className="h-5 w-5" />, desc: 'Primary writing area with support for columns and formatting' },
            { type: 'image', label: 'Image / Figure', icon: <ImageIcon className="h-5 w-5" />, desc: 'Single high-quality image with caption' },
            { type: 'video', label: 'Video Embed', icon: <Video className="h-5 w-5" />, desc: 'YouTube, Vimeo or direct video link' },
        ]
    },
    {
        name: 'Editorial Elements',
        icon: <BookOpen className="h-4 w-4" />,
        blocks: [
            { type: 'quote_block', label: 'Editorial Quote', icon: <Quote className="h-5 w-5" />, desc: 'Large pull-quote to highlight key points' },
            { type: 'image_gallery', label: 'Image Gallery', icon: <Layers className="h-5 w-5" />, desc: 'Grid or slider of multiple images' },
            { type: 'code_snippet', label: 'Code Block', icon: <Code className="h-5 w-5" />, desc: 'Syntax highlighted code for technical articles' },
        ]
    },
    {
        name: 'Related & Dynamic',
        icon: <LinkIcon className="h-4 w-4" />,
        blocks: [
            { type: 'insights', label: 'Related Insights', icon: <BookOpen className="h-5 w-5" />, desc: 'Link to other relevant blog posts' },
            { type: 'cta', label: 'Call to Action', icon: <Plus className="h-5 w-5" />, desc: 'Newsletter signup or link button' },
        ]
    }
];

export default function BlogAddBlockMenu({ onAddBlock, children }: BlogAddBlockMenuProps) {
    const [open, setOpen] = React.useState(false);

    const handleAdd = (type: BlockType) => {
        onAddBlock(type);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button 
                        variant="outline" 
                        className="w-full py-8 border-dashed border-2 hover:border-agency-accent hover:bg-agency-accent/5 group transition-all rounded-xl"
                    >
                        <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Add Section to Article
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-6 border-b">
                    <DialogTitle>Add Article Section</DialogTitle>
                    <DialogDescription>
                        Choose a component to add to your blog post. These are optimized for readability.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {BLOG_BLOCKS.map((category) => (
                        <div key={category.name} className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                                {category.icon}
                                <span>{category.name}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {category.blocks.map((block) => (
                                    <button
                                        key={block.type}
                                        onClick={() => handleAdd(block.type as BlockType)}
                                        className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:border-agency-accent hover:bg-agency-accent/[0.02] hover:shadow-sm transition-all text-left group"
                                    >
                                        <div className="mt-1 p-2 rounded-lg bg-muted group-hover:bg-agency-accent/10 group-hover:text-agency-accent transition-colors">
                                            {block.icon}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{block.label}</div>
                                            <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                {block.desc}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
