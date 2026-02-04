import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Package, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Plugin {
    id: string;
    name: string;
    version: string;
    status: 'active' | 'inactive' | 'error';
    description: string;
}

export default function ComponentImporter() {
    const [plugins] = useState<Plugin[]>([
        { id: '1', name: 'Dynamic Carousel', version: '1.0.0', status: 'active', description: '3D Parallax carousel component.' }
    ]);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('plugin_zip', file);

        try {
            const response = await fetch('/admin/plugins/component-importer', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                toast.success(data.message || "Plugin uploaded successfully");
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("An error occurred during upload");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Plugin Manager</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Upload and manage dynamic page builder components.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-2">
                        <CardHeader>
                            <CardTitle className="uppercase tracking-widest text-sm flex items-center gap-2">
                                <Package className="h-4 w-4" /> Installed Plugins
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {plugins.map((plugin) => (
                                    <div key={plugin.id} className="flex items-center justify-between p-4 border rounded-xl bg-muted/5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{plugin.name}</span>
                                                <Badge variant="outline" className="text-[10px]">{plugin.version}</Badge>
                                                {plugin.status === 'active' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{plugin.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">Configure</Button>
                                            <Button variant="ghost" size="sm" className="text-destructive">Uninstall</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-agency-accent/20 bg-agency-accent/5">
                        <CardHeader>
                            <CardTitle className="uppercase tracking-widest text-sm flex items-center gap-2">
                                <Upload className="h-4 w-4" /> Upload Plugin
                            </CardTitle>
                            <CardDescription>Upload a .zip package containing your custom component.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 bg-background">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">ZIP packages only (max 10MB)</p>
                                </div>
                                <Input type="file" className="hidden" id="plugin-upload" onChange={handleUpload} accept=".zip" />
                                <Label htmlFor="plugin-upload" className="cursor-pointer">
                                    <Button variant="outline" size="sm" asChild>
                                        <span>Select File</span>
                                    </Button>
                                </Label>
                            </div>

                            <Button className="w-full bg-agency-accent text-white" disabled={isUploading} asChild>
                                <Label htmlFor="plugin-upload" className="cursor-pointer flex items-center justify-center">
                                    {isUploading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    {isUploading ? "Uploading..." : "Register Plugin"}
                                </Label>
                            </Button>

                            <div className="flex items-start gap-3 p-4 bg-background rounded-xl border">
                                <AlertCircle className="h-5 w-5 text-agency-accent shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-relaxed">
                                    Plugins are automatically registered with the BlockRegistry and available in the Page Builder immediately after upload.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
