---
name: Page Builder Block Integration
description: Standard workflow for adding new dynamic blocks to the Laravel Page Builder (Types, Renderer, Editor, Registry)
---

# Page Builder Block Integration

Use this skill when you need to add a new dynamic component (block) to the Page Builder. This ensures the block is properly typed, has a functional editor, and is correctly registered in the system.

## Workflow Steps

### 1. Update Type Definitions
First, define the structure of the block's content in the TypeScript definitions file.

- **File**: `resources/js/types/page-blocks.d.ts`
- **Action**: 
    1. Create a new interface (e.g., `MyNewBlock`) extending `BaseBlock`.
    2. Add the new interface to the `PageBlock` union type.

```typescript
export interface MyNewBlock extends BaseBlock {
    type: 'my_new_block';
    content: {
        title?: string;
        // ... other fields
    };
}

export type PageBlock = 
    // ... existing types
    | MyNewBlock;
```

### 2. Create the Block Renderer
Create the frontend component that will render the block for visitors.

- **Directory**: `resources/js/components/Blocks/`
- **Conventions**:
    - Use `AnimatedSection` for animations.
    - Use Shadcn UI components from `@/components/ui`.
    - Handle empty states gracefully.
    - Ensure responsive design and accessibility.
    - **Crucial**: Center UI elements like buttons or tabs if they are top-level triggers.

### 3. Create the Block Editor
Create the administration interface for customizing the block content.

- **Directory**: `resources/js/components/admin/PageBuilder/editors/`
- **Conventions**:
    - Import `Feature108Block` (or equivalent) for props typing.
    - Use `MediaLibrary` for image/video assets.
    - Use `Input`, `Label`, `Textarea` for basic fields.
    - Implement an `updateContent` helper to call `onUpdate`.

```typescript
interface Props {
    content: MyNewBlock['content'];
    onUpdate: (updates: Partial<MyNewBlock['content']>) => void;
}
```

### 4. Register the Block
Register the block in the system to make it available in the "Add Section" menu and the renderer.

- **File**: `resources/js/lib/registerBlocks.tsx`
- **Action**:
    1. Lazy load both the Renderer and Editor.
    2. Call `blockRegistry.register()` with the block metadata.

```typescript
const MyNewBlock = React.lazy(() => import('@/components/Blocks/MyNewBlock'));
const MyNewBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/MyNewBlockEditor'));

blockRegistry.register({
    type: 'my_new_block',
    label: 'My New Block Name',
    icon: <Sparkles className="h-4 w-4" />,
    desc: 'Description shown in the menu.',
    category: 'Features', // or Heroes, Media, Content, etc.
    renderer: (props: MyNewBlock['content']) => (
        <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
            <MyNewBlock {...props} />
        </React.Suspense>
    ),
    editor: (props: { content: MyNewBlock['content']; onUpdate: (updates: any) => void }) => (
        <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
            <MyNewBlockEditor {...props} />
        </React.Suspense>
    )
});
```

## Best Practices

- **Dynamic Imports**: Always lazy-load blocks to keep the main bundle small.
- **Type Safety**: Avoid using `any`. Use the interfaces defined in `page-blocks.d.ts`.
- **UI Consistency**: Use the project's design tokens (agency-accent, muted-foreground, etc.).
- **Tabs/Buttons**: Always ensure tab buttons or main CTAs are center-aligned unless explicitly asked otherwise for specific layouts.
- **Media**: Always provide a way to pick assets via `MediaLibrary`.

## Verification Checklist

- [ ] Block appears in "Add Section" menu under the correct category.
- [ ] Editor opens and fields update the preview correctly.
- [ ] Media selection works as expected.
- [ ] Block renders correctly on the frontend with animations.
- [ ] Responsive behavior is tested (mobile vs desktop).
