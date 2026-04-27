import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
    Monitor, 
    Tablet, 
    Smartphone, 
    Maximize2, 
    Minimize2,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import { Block } from '@/pages/admin/pages/Edit';

interface VisualPreviewProps {
    blocks: Block[];
    pageTitle: string;
    pageSlug: string;
    previewBaseUrl: string;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

export default function VisualPreview({
    blocks,
    pageTitle,
    pageSlug,
    previewBaseUrl,
    isFullscreen,
    onToggleFullscreen
}: VisualPreviewProps) {
    const [device, setDevice] = useState<DeviceType>('desktop');
    const [isLoading, setIsLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const deviceConfigs = {
        desktop: { width: 1920, height: 1080, label: '1920 x 1080' },
        tablet: { width: 768, height: 1024, label: '768 x 1024' },
        mobile: { width: 390, height: 844, label: '390 x 844' },
    };

    const updateScale = React.useCallback(() => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        const target = deviceConfigs[device];

        const scaleX = containerWidth / target.width;
        const scaleY = containerHeight / target.height;
        
        // Use the smaller scale to ensure the whole "device" fits in the view
        const newScale = Math.min(scaleX, scaleY, 1);
        
        setScale(newScale);
    }, [device]);

    // Update scale on resize and device change
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            updateScale();
        });

        resizeObserver.observe(container);
        updateScale(); // Initial call

        return () => {
            resizeObserver.disconnect();
        };
    }, [updateScale]);

    const refreshPreview = React.useCallback(() => {
        setIsLoading(true);
        if (iframeRef.current) {
            const url = pageSlug === 'home' ? '/' : `${previewBaseUrl}/${pageSlug}`;
            iframeRef.current.src = `${url}?preview=true&t=${Date.now()}`;
        }
    }, [pageSlug, previewBaseUrl]);

    useEffect(() => {
        const url = pageSlug === 'home' ? '/' : `${previewBaseUrl}/${pageSlug}`;
        const newSrc = `${url}?preview=true&t=${Date.now()}`;
        
        if (iframeRef.current) {
            iframeRef.current.src = newSrc;
        }
    }, [pageSlug, previewBaseUrl]);

    useEffect(() => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'PREVIEW_DATA_UPDATE',
                blocks: blocks,
            }, '*');
        }
    }, [blocks]);

    const targetConfig = deviceConfigs[device];

    return (
        <div className="flex flex-col h-full bg-background/50">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b bg-muted/20">
                <div className="flex items-center gap-1">
                    <Button
                        variant={device === 'desktop' ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDevice('desktop')}
                        title="Desktop view (1920x1080)"
                    >
                        <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={device === 'tablet' ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDevice('tablet')}
                        title="Tablet view (768x1024)"
                    >
                        <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={device === 'mobile' ? 'default' : 'outline'}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setDevice('mobile')}
                        title="Mobile view (390x844)"
                    >
                        <Smartphone className="h-4 w-4" />
                    </Button>
                    
                    <div className="h-4 w-px bg-border mx-2" />
                    
                    <div className="flex items-center gap-2 px-2 py-1 bg-background/50 rounded border border-border/50">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">Resolution:</span>
                        <span className="text-[10px] font-mono font-bold text-agency-accent">{targetConfig.label}</span>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground ml-1">({Math.round(scale * 100)}%)</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground mr-2">
                        {pageTitle}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refreshPreview}>
                        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Open in new tab">
                        <a href={pageSlug === 'home' ? '/' : `${previewBaseUrl}/${pageSlug}`} target="_blank" rel="noreferrer" aria-label="Open page in new tab">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleFullscreen}>
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-hidden flex justify-center bg-dots-grid relative"
            >
                <div 
                    className="transition-all duration-500 ease-in-out bg-white shadow-2xl rounded-t-lg overflow-hidden border border-border/50 origin-top flex-shrink-0"
                    style={{
                        width: targetConfig.width,
                        height: targetConfig.height,
                        transform: `scale(${scale})`,
                    }}
                >
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full border-none"
                        title="Page Preview"
                        style={{ width: targetConfig.width, height: targetConfig.height }}
                        onLoad={() => setIsLoading(false)}
                    />
                </div>
            </div>
        </div>
    );
}
