import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router, usePage } from '@inertiajs/react';
import { Monitor, Moon, Save, Sun } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { SharedData } from '@/types';
import { Appearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function GlobalAppearanceSetting() {
    const { props } = usePage<SharedData>();
    // The current global default is shared via props.theme.preset-like structures or settings
    // In our case, it's in props.theme.default_appearance (if we add it to HandleInertiaRequests)
    // For now, let's find it in the shared settings or fallback to 'system'
    const currentGlobalDefault = (props.theme as { default_appearance: Appearance }).default_appearance || 'system';
    
    const [selected, setSelected] = useState<Appearance>(currentGlobalDefault);
    const [processing, setProcessing] = useState(false);

    const handleSave = () => {
        setProcessing(true);
        
        // Use the existing admin settings update route
        router.post('/admin/settings', {
            settings: [
                {
                    key: 'default_appearance',
                    value: selected,
                    type: 'select',
                    group_name: 'theme'
                }
            ],
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Global site theme updated successfully');
                setProcessing(false);
            },
            onError: () => {
                toast.error('Failed to update global theme');
                setProcessing(false);
            }
        });
    };

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Save className="w-5 h-5 text-primary" />
                    Global Site Default
                </CardTitle>
                <CardDescription>
                    As an admin, you can set the default theme for all visitors who haven't set a preference.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'system', label: 'System', icon: Monitor },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            type="button"
                            onClick={() => setSelected(mode.id as Appearance)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                                selected === mode.id 
                                    ? "border-primary bg-primary/10" 
                                    : "border-border bg-background hover:border-primary/50"
                            )}
                        >
                            <mode.icon className={cn("w-6 h-6", selected === mode.id ? "text-primary" : "text-muted-foreground")} />
                            <span className="text-xs font-semibold">{mode.label}</span>
                        </button>
                    ))}
                </div>
                
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={processing || selected === currentGlobalDefault}>
                        {processing ? 'Saving...' : 'Set as Global Default'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
