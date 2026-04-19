import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { 
    Search, 
    Type, 
    Zap, 
    Check, 
    ChevronDown, 
    X, 
    Star, 
    Heart, 
    Home, 
    Settings, 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Info, 
    AlertCircle, 
    CheckCircle2, 
    ArrowRight, 
    Download, 
    Upload, 
    Globe, 
    ExternalLink, 
    Layout, 
    Image as LucideImage, 
    FileText 
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import CategoryIcon, { CategorySlug } from '@/components/CategoryIcon';
import { IconType } from '@/components/DynamicIcon';

interface IconPickerProps {
    value: string;
    type?: IconType;
    onChange: (value: string, type: IconType) => void;
    className?: string;
}

const customIcons: CategorySlug[] = [
    'festival-fever',
    'glocal-gems',
    'living-from-the-heart',
    'social-sustainability',
    'solo-travel',
    'travel-trouble'
];

const popularLucideIcons = [
    'Star', 'Heart', 'Zap', 'Home', 'Settings', 'User', 'Mail', 'Phone', 'MapPin', 
    'Calendar', 'Info', 'AlertCircle', 'CheckCircle2', 'ArrowRight', 'Download', 
    'Upload', 'Globe', 'ExternalLink', 'Layout', 'Image', 'FileText', 'Play', 
    'Pause', 'Square', 'Circle', 'Triangle', 'Bell', 'Search', 'Clock', 'Menu', 'MoreHorizontal'
];

export const IconPicker: React.FC<IconPickerProps> = ({ 
    value, 
    type = 'lucide', 
    onChange, 
    className 
}) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredLucide = popularLucideIcons.filter(name => 
        name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (iconName: string, iconType: IconType) => {
        onChange(iconName, iconType);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    className={cn("w-full justify-between h-10 px-3 font-normal", className)}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {value ? (
                            <>
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                                    {type === 'custom' ? (
                                        <CategoryIcon category={value as CategorySlug} size={16} glow={false} />
                                    ) : (
                                        (() => {
                                            const Icon = (Icons as any)[value];
                                            return Icon ? <Icon size={16} /> : <div className="w-4 h-4 bg-muted rounded" />;
                                        })()
                                    )}
                                </div>
                                <span className="truncate text-xs">{value}</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground text-xs">Select icon...</span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-background shadow-2xl border border-border/50 relative z-[100]" align="start">
                <Tabs defaultValue={type} className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-muted/30 h-10 px-1">
                        <TabsTrigger value="lucide" className="text-[10px] uppercase font-bold tracking-wider">Lucide</TabsTrigger>
                        <TabsTrigger value="custom" className="text-[10px] uppercase font-bold tracking-wider">Custom (Stitch)</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="lucide" className="p-3 m-0 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input 
                                placeholder="Search common icons..." 
                                className="pl-8 h-9 text-xs" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        
                        <div className="grid grid-cols-6 gap-2 max-h-[160px] overflow-y-auto pr-1">
                            {filteredLucide.map(name => {
                                const Icon = (Icons as any)[name === 'Image' ? 'LucideImage' : name];
                                return (
                                    <button
                                        key={name}
                                        onClick={() => handleSelect(name, 'lucide')}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded-md transition-colors hover:bg-muted group",
                                            value === name && type === 'lucide' && "bg-primary/10 ring-1 ring-primary/30"
                                        )}
                                        title={name}
                                    >
                                        {Icon && <Icon className="h-4 w-4" />}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="pt-2 border-t">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold mb-1.5 block">Manually enter name</Label>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Icon name (e.g. Activity)" 
                                    className="h-8 text-xs" 
                                    value={type === 'lucide' && !popularLucideIcons.includes(value) ? value : search}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSearch(val);
                                        // Dynamic preview?
                                    }}
                                />
                                <Button 
                                    size="sm" 
                                    className="h-8 px-2" 
                                    onClick={() => handleSelect(search, 'lucide')}
                                    disabled={!search}
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="custom" className="p-3 m-0">
                        <div className="grid grid-cols-3 gap-3">
                            {customIcons.map(slug => (
                                <button
                                    key={slug}
                                    onClick={() => handleSelect(slug, 'custom')}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-lg border bg-muted/5 transition-all hover:bg-muted/20 hover:border-primary/50",
                                        value === slug && type === 'custom' && "border-primary bg-primary/5 ring-1 ring-primary/30"
                                    )}
                                >
                                    <CategoryIcon category={slug} size={32} glow={false} />
                                    <span className="text-[8px] mt-2 text-center uppercase tracking-tighter line-clamp-1 opacity-60">
                                        {slug.replace(/-/g, ' ')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
                
                {value && (
                    <div className="p-2 bg-muted/30 border-t flex justify-between items-center">
                        <span className="text-[10px] font-medium text-muted-foreground">Current: {value}</span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-1.5 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleSelect('', 'lucide')}
                        >
                            Clear
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default IconPicker;
