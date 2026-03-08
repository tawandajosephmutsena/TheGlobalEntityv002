---
name: Public Frontend Components
description: Create dynamic public-facing components for the page builder, ensuring theme integration, rich text support, and correct registration within existing categories.
---

# Public Frontend Components

Use this skill when you need to create or add components (blocks) to the public-facing page builder. These components must have dynamic text, media, links, and buttons, use rich text for descriptions and larger text fields, and integrate seamlessly with the existing theme system and styles. They should also exist alongside similar components in the "Add Section" modal unless a new category is specifically required.

## Workflow Steps

### 1. Update Type Definitions

Define the data structure of the block's content required by the page builder backend.

- **File**: `resources/js/types/page-blocks.d.ts`
- **Action**: Create a new interface (e.g., `MyNewDynamicBlock`) extending `BaseBlock`, and add it to the `PageBlock` union type.

```typescript
export interface MyNewDynamicBlock extends BaseBlock {
    type: 'my_new_dynamic_block';
    content: {
        badge?: string;
        heading?: string;
        description?: string; // This will hold the HTML string from RichTextEditor
        buttonText?: string;
        buttonLink?: string;
        imageSrc?: string;
        imageAlt?: string;
        // Optionally add nested lists or tabs
        items?: Array<{
            title: string;
            description: string;
            // ...
        }>;
    };
}
// Add to PageBlock union type at the bottom of the file
```

### 2. Create the Block Renderer (Frontend)

Build the frontend presence of the block, using existing theme colors, typography, spacing, and styling conventions.

- **Directory**: `resources/js/components/Blocks/`
- **Conventions**:
  - **Styles & Themes**: Use existing Tailwind theme colors (e.g., `bg-background`, `text-foreground`, `text-primary`, `bg-muted`).
  - **Buttons and Links**: Use shadcn/ui components like `Button` or custom `Link` components where feasible.
  - **Rich Text Rendering**: Since `description` or larger text fields are rich text, you must render them safely using `dangerouslySetInnerHTML`. Add Tailwind's `prose` class or appropriate margin/typography classes to style the HTML correctly (e.g., `className="prose prose-sm dark:prose-invert"`).
  - **Media**: Handle images gracefully. Use `img` with appropriate `src`, `alt`, `className`, and default placeholders.
  - Handle null/undefined values dynamically to avoid crashes if fields are empty.

```tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MyNewDynamicBlock } from '@/types/page-blocks';
import AnimatedSection from '@/components/AnimatedSection';

const MyNewDynamicBlockRenderer = ({ badge, heading, description, buttonText, buttonLink, imageSrc, imageAlt }: MyNewDynamicBlock['content']) => {
    return (
        <AnimatedSection className="py-16 md:py-24 bg-background text-foreground">
            <div className="container mx-auto px-4 ...">
                {badge && <div className="text-sm font-semibold text-primary mb-2">{badge}</div>}
                {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
                {/* Dynamically render Rich Text */}
                {description && (
                    <div 
                        className="prose prose-sm md:prose-base dark:prose-invert text-muted-foreground mb-8"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}
                {buttonText && buttonLink && (
                    <Button asChild>
                        <a href={buttonLink}>{buttonText}</a>
                    </Button>
                )}
                {/* Media rendering */}
                {imageSrc && (
                    <img src={imageSrc} alt={imageAlt || "Section Image"} className="rounded-xl mt-8" />
                )}
            </div>
        </AnimatedSection>
    );
};

export default MyNewDynamicBlockRenderer;
```

### 3. Create the Block Editor (Admin)

Create the editor component in the admin interface to allow users to update the block dynamically.

- **Directory**: `resources/js/components/admin/PageBuilder/editors/`
- **Conventions**:
  - Use `Input` for short text fields (badge, heading, button text, links).
  - Use `MediaLibrary` for selecting or managing dynamic media (images, videos).
  - Use **`RichTextEditor`** for `description` or any larger, multi-line text fields so the user can format their content.
  - Update changes using the provided `onUpdate` prop.

```tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { MediaAsset } from '@/types';
import { MyNewDynamicBlock } from '@/types/page-blocks';

interface Props {
    content: MyNewDynamicBlock['content'];
    onUpdate: (updates: Partial<MyNewDynamicBlock['content']>) => void;
}

const MyNewDynamicBlockEditor = ({ content, onUpdate }: Props) => {
    const updateContent = (updates: Partial<MyNewDynamicBlock['content']>) => {
        onUpdate({ ...content, ...updates });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Badge</Label>
                <Input value={content.badge || ''} onChange={(e) => updateContent({ badge: e.target.value })} />
            </div>
            
            <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={content.heading || ''} onChange={(e) => updateContent({ heading: e.target.value })} />
            </div>

            <div className="space-y-2">
                <Label>Description (Rich Text)</Label>
                {/* Using RichTextEditor for dynamic larger text fields */}
                <RichTextEditor 
                    content={content.description || ''} 
                    onChange={(html) => updateContent({ description: html })} 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input value={content.buttonText || ''} onChange={(e) => updateContent({ buttonText: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label>Button Link</Label>
                    <Input value={content.buttonLink || ''} onChange={(e) => updateContent({ buttonLink: e.target.value })} placeholder="https://" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Image / Media</Label>
                <div className="flex gap-2">
                    <MediaLibrary
                        onSelect={(asset: MediaAsset) => updateContent({ imageSrc: asset.url })}
                        trigger={
                            <Button size="sm" variant="outline" className="h-8 text-xs">
                                <ImageIcon className="h-3 w-3 mr-1" /> Choose Image
                            </Button>
                        }
                    />
                    <Input 
                        className="h-8 text-xs flex-1" 
                        value={content.imageSrc || ''} 
                        onChange={(e) => updateContent({ imageSrc: e.target.value })} 
                        placeholder="Image URL..." 
                    />
                </div>
            </div>
        </div>
    );
};

export default MyNewDynamicBlockEditor;
```

### 4. Register the Block

Ensure your block appears in the "Add Component" modal.

- **File**: `resources/js/lib/registerBlocks.tsx`
- **Conventions**:
  - Evaluate the existing categories (e.g., `'Heroes'`, `'Features'`, `'Testimonials'`, `'Media'`, `'Content'`) and add the block to the **most relevant existing category**. Only create a new category if the block represents an entirely new domain.
  - Provide a distinct `icon`, a descriptive `label`, and a helpful `desc`.

```tsx
// Inside registerBlocks.tsx
import { Sparkles } from 'lucide-react';

const MyNewDynamicBlock = React.lazy(() => import('@/components/Blocks/MyNewDynamicBlockRenderer'));
const MyNewDynamicBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/MyNewDynamicBlockEditor'));

blockRegistry.register({
    type: 'my_new_dynamic_block',
    label: 'Dynamic Feature Component', // Distinct descriptive name
    icon: <Sparkles className="h-4 w-4" />, // Choose relevant lucide-react icon
    desc: 'Display dynamic features with rich text descriptions, links, and media.',
    category: 'Features', // Use existing category! Only create new if strictly needed.
    renderer: (props: any) => (
        <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
            <MyNewDynamicBlock {...props} />
        </React.Suspense>
    ),
    editor: (props: { block: any; content: any; onUpdate: (updates: any) => void }) => (
        <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
            <MyNewDynamicBlockEditor {...props} />
        </React.Suspense>
    )
});
```

> [!WARNING]
> **CRITICAL**: Do NOT use inline type imports (e.g. `import('@/types/...').Block`) inside `registerBlocks.tsx` as it causes silent failures in Vite/esbuild where blocks randomly disappear from the registry. Always use `any` types for the `renderer` and `editor` props arrays directly in the registry file.

## Best Practices

- **Rich Text is Crucial**: Anytime an editor might want to bold, bullet, or format text, use `<RichTextEditor />` instead of `<Textarea />`.
- **Theme Matching**: Use `text-primary`, `bg-muted`, `bg-background`, `border-border`, etc. Avoid hardcoding HEX/RGB colors unless specified. This allows seamless light/dark mode and brand theme integration.
- **Data Validation**: Avoid rendering components that expect data if the data is not present (e.g. dont render an `<img>` tag if `imageSrc` is empty).
- **Lazy Loading**: Use `React.lazy` on all new elements exported via block registry. Keep the main application chunk small.

## Verification Checklist

- [ ] Block has definition defined in `page-blocks.d.ts`.
- [ ] All inputs (text, button links, images) are fully dynamic.
- [ ] Sub-sections or array-driven tabs are dynamically repeatable if needed.
- [ ] Text description correctly leverages `RichTextEditor` in admin modal.
- [ ] Frontend successfully renders HTML output using `dangerouslySetInnerHTML`.
- [ ] Component appears logically alongside peers in the Page Builder Modal.
- [ ] Uses theme/tailwind styles avoiding inline specific colors.
