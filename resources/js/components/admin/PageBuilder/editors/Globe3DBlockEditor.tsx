import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Globe, MapPin, Sun, Settings2 } from 'lucide-react';
import type { Globe3DBlock } from '@/types/page-blocks';

interface Props {
    content: Globe3DBlock['content'];
    onUpdate: (updates: Partial<Globe3DBlock['content']>) => void;
}

// Well-known cities for quick-add dropdown
const PRESET_LOCATIONS = [
    { label: 'New York, USA', lat: 40.7128, lng: -74.006 },
    { label: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { label: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { label: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
    { label: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { label: 'New Delhi, India', lat: 28.6139, lng: 77.209 },
    { label: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
    { label: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
    // Africa
    { label: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
    { label: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792 },
    { label: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241 },
    { label: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
    { label: 'Marrakech, Morocco', lat: 31.6295, lng: -7.9811 },
    { label: 'Accra, Ghana', lat: 5.6037, lng: -0.187 },
    { label: 'Addis Ababa, Ethiopia', lat: 9.0192, lng: 38.7525 },
    { label: 'Dar es Salaam, Tanzania', lat: -6.7924, lng: 39.2083 },
    { label: 'Johannesburg, South Africa', lat: -26.2041, lng: 28.0473 },
    // More
    { label: 'Toronto, Canada', lat: 43.6532, lng: -79.3832 },
    { label: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332 },
    { label: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
    { label: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
    { label: 'Seoul, South Korea', lat: 37.5665, lng: 126.978 },
    { label: 'Berlin, Germany', lat: 52.52, lng: 13.405 },
    { label: 'Moscow, Russia', lat: 55.7558, lng: 37.6173 },
];

export default function Globe3DBlockEditor({ content, onUpdate }: Props) {
    const [quickAdd, setQuickAdd] = useState('');

    const updateContent = (updates: Partial<Globe3DBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    const markers = content.markers || [];

    const addMarker = (lat = 0, lng = 0, label = 'New Marker') => {
        const newMarker = {
            id: Math.random().toString(36).substr(2, 9),
            lat,
            lng,
            label,
            src: 'https://assets.aceternity.com/avatars/1.webp',
        };
        updateContent({ markers: [...markers, newMarker] });
    };

    const updateMarker = (id: string, updates: Partial<typeof markers[number]>) => {
        const newMarkers = markers.map((m) =>
            m.id === id ? { ...m, ...updates } : m
        );
        updateContent({ markers: newMarkers });
    };

    const removeMarker = (id: string) => {
        updateContent({ markers: markers.filter((m) => m.id !== id) });
    };

    const handleQuickAdd = (value: string) => {
        setQuickAdd(value);
        const preset = PRESET_LOCATIONS.find((p) => p.label === value);
        if (preset) {
            addMarker(preset.lat, preset.lng, preset.label);
            setQuickAdd('');
        }
    };

    return (
        <div className="space-y-10 p-2">
            {/* ── Globe Markers ──────────────── */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                        <MapPin className="size-5" />
                        <h3 className="text-lg font-bold uppercase tracking-wider">Markers</h3>
                    </div>
                    <Button onClick={() => addMarker()} size="sm" variant="outline" className="rounded-full">
                        <Plus className="size-4 mr-2" /> Custom Marker
                    </Button>
                </div>

                {/* Quick Add */}
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Quick Add City</Label>
                    <Select value={quickAdd} onValueChange={handleQuickAdd}>
                        <SelectTrigger className="h-9 bg-background">
                            <SelectValue placeholder="Select a city to add..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                            {PRESET_LOCATIONS.map((loc) => (
                                <SelectItem key={loc.label} value={loc.label}>
                                    {loc.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Marker List */}
                <div className="grid grid-cols-1 gap-3">
                    {markers.map((marker) => (
                        <Card key={marker.id} className="relative group border-muted shadow-none bg-muted/20">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                onClick={() => removeMarker(marker.id)}
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                            <CardContent className="p-4 space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                                        <Input
                                            className="h-8 text-xs bg-background"
                                            placeholder="City name"
                                            value={marker.label || ''}
                                            onChange={(e) => updateMarker(marker.id, { label: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Latitude</Label>
                                        <Input
                                            className="h-8 text-xs bg-background font-mono"
                                            type="number"
                                            step="0.0001"
                                            value={marker.lat}
                                            onChange={(e) => updateMarker(marker.id, { lat: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Longitude</Label>
                                        <Input
                                            className="h-8 text-xs bg-background font-mono"
                                            type="number"
                                            step="0.0001"
                                            value={marker.lng}
                                            onChange={(e) => updateMarker(marker.id, { lng: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Avatar URL</Label>
                                    <Input
                                        className="h-8 text-xs bg-background"
                                        placeholder="https://..."
                                        value={marker.src || ''}
                                        onChange={(e) => updateMarker(marker.id, { src: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {markers.length === 0 && (
                        <div className="text-center p-8 border-2 border-dashed rounded-2xl text-muted-foreground italic">
                            No markers added yet. Add markers using the quick-add dropdown or custom button above.
                            <br />
                            <span className="text-xs">Default markers (10 world cities) will be shown if none are configured.</span>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Lighting & Atmosphere ──────────────── */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                    <Sun className="size-5" />
                    <h3 className="text-lg font-bold uppercase tracking-wider">Lighting</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                            Ambient Light: {content.ambientIntensity ?? 1.2}
                        </Label>
                        <Slider
                            value={[content.ambientIntensity ?? 1.2]}
                            onValueChange={([val]) => updateContent({ ambientIntensity: val })}
                            min={0}
                            max={3}
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                            Directional Light: {content.pointLightIntensity ?? 2.0}
                        </Label>
                        <Slider
                            value={[content.pointLightIntensity ?? 2.0]}
                            onValueChange={([val]) => updateContent({ pointLightIntensity: val })}
                            min={0}
                            max={5}
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                            Terrain Bump: {content.bumpScale ?? 3}
                        </Label>
                        <Slider
                            value={[content.bumpScale ?? 3]}
                            onValueChange={([val]) => updateContent({ bumpScale: val })}
                            min={0}
                            max={10}
                            step={0.5}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                            Rotation Speed: {content.autoRotateSpeed ?? 0.3}
                        </Label>
                        <Slider
                            value={[content.autoRotateSpeed ?? 0.3]}
                            onValueChange={([val]) => updateContent({ autoRotateSpeed: val })}
                            min={0}
                            max={3}
                            step={0.1}
                        />
                    </div>
                </div>
            </section>

            {/* ── Atmosphere ──────────────── */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <Globe className="size-5" />
                    <h3 className="text-lg font-bold uppercase tracking-wider">Atmosphere & Display</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label className="text-xs font-bold">Show Atmosphere</Label>
                            <p className="text-[10px] text-muted-foreground">Blue glow around globe</p>
                        </div>
                        <Switch
                            checked={content.showAtmosphere ?? false}
                            onCheckedChange={(checked) => updateContent({ showAtmosphere: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label className="text-xs font-bold">Show Wireframe</Label>
                            <p className="text-[10px] text-muted-foreground">Overlay grid lines</p>
                        </div>
                        <Switch
                            checked={content.showWireframe ?? false}
                            onCheckedChange={(checked) => updateContent({ showWireframe: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                            <Label className="text-xs font-bold">Allow Zoom</Label>
                            <p className="text-[10px] text-muted-foreground">Scroll to zoom</p>
                        </div>
                        <Switch
                            checked={content.enableZoom ?? false}
                            onCheckedChange={(checked) => updateContent({ enableZoom: checked })}
                        />
                    </div>
                </div>

                {content.showAtmosphere && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Atmosphere Color</Label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={content.atmosphereColor || '#4da6ff'}
                                    onChange={(e) => updateContent({ atmosphereColor: e.target.value })}
                                    className="h-8 w-8 rounded cursor-pointer border"
                                    title="Atmosphere Color"
                                />
                                <Input
                                    className="h-8 text-xs bg-background flex-1 font-mono"
                                    value={content.atmosphereColor || '#4da6ff'}
                                    onChange={(e) => updateContent({ atmosphereColor: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                                Atmosphere Intensity: {content.atmosphereIntensity ?? 0.5}
                            </Label>
                            <Slider
                                value={[content.atmosphereIntensity ?? 0.5]}
                                onValueChange={([val]) => updateContent({ atmosphereIntensity: val })}
                                min={0}
                                max={3}
                                step={0.1}
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* ── Size ──────────────── */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <Settings2 className="size-5" />
                    <h3 className="text-lg font-bold uppercase tracking-wider">Sizing</h3>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Globe Height</Label>
                    <Select
                        value={content.height || '500px'}
                        onValueChange={(val) => updateContent({ height: val })}
                    >
                        <SelectTrigger className="h-9 bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="300px">Small (300px)</SelectItem>
                            <SelectItem value="400px">Medium (400px)</SelectItem>
                            <SelectItem value="500px">Large (500px)</SelectItem>
                            <SelectItem value="600px">Extra Large (600px)</SelectItem>
                            <SelectItem value="700px">Full Section (700px)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>
        </div>
    );
}
