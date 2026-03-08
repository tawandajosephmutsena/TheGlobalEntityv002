import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardsSliderBlock } from '@/types/page-blocks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  content: CardsSliderBlock['content'];
  onUpdate: (content: CardsSliderBlock['content']) => void;
}

export default function CardsSliderBlockEditor({ content, onUpdate }: Props) {
  const handleChange = (field: keyof CardsSliderBlock['content'], value: any) => {
    onUpdate({
      ...content,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
        <h4 className="font-medium text-sm">Dynamic Data Source</h4>
        <div className="space-y-2">
          <Label>Collection to Display</Label>
          <Select
            value={content.collection ?? 'insights'}
            onValueChange={(val) => handleChange('collection', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insights">Insights / Blog</SelectItem>
              <SelectItem value="portfolio">Portfolio / Works</SelectItem>
              <SelectItem value="services">Services</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Select which content collection to surface in this slider.</p>
        </div>

        <div className="space-y-2 pt-2">
          <Label>Maximum Items to Show</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={content.limit ?? 5}
            onChange={(e) => handleChange('limit', parseInt(e.target.value) || 5)}
          />
        </div>
      </div>
    </div>
  );
}
