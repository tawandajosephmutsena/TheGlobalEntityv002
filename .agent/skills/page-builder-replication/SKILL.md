---
name: Page Builder Replication
description: Detailed guide for replicating a dynamic, block-based page builder system with Inertia.js, React, and real-time iframe preview.
---

# Page Builder Replication Guide

This skill provides a comprehensive technical blueprint for implementing a dynamic, block-based page builder system. It is modeled after a refined architecture that decouples block definitions from the rendering engine, enabling high extensibility and performance.

## Core Architecture Highlights

- **Block-Based Data Structure**: Pages are stored as a JSON array of "blocks," each with a `type` and a `content` object.
- **Decoupled Registry**: A centralized `BlockRegistry` maps block types to their respective frontend renderers and admin editors.
- **Lazy Loading**: Renderers and editors are loaded on-demand via `React.lazy`, keeping initial bundles small.
- **Real-Time Preview**: An iframe-based preview system uses the `postMessage` API to provide instant visual feedback during editing.
- **SEO & Metadata**: Integrated management for page-level settings like title, slug, status, and SEO metadata.

---

## 🏗️ 1. Backend Foundation (Laravel/Eloquent)

### The Page Model
The `Page` model represents the database entry. It must handle the blocks as a JSON field.

```php
// app/Models/Page.php
protected $fillable = [
    'title', 'slug', 'content', 'status', 'meta_title', 'meta_description', 'template'
];

protected $casts = [
    'content' => 'json', // This is where the blocks array lives
];
```

### Routing
A "catch-all" route is typically needed for the public-facing pages, while the admin requires CRUD routes.

```php
// routes/web.php
// Admin Routes (Inertia)
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::resource('pages', AdminPageController::class);
});

// Catch-all Public Route
Route::get('{slug}', [PageController::class, 'show'])->where('slug', '.*');
```

---

## 🧱 2. The Block Registry System

To keep the system extensible, avoid hardcoding blocks in a huge switch statement. Use a registry.

### `BlockRegistry.ts`
A singleton that holds the map of all registered blocks.

```typescript
import { LazyExoticComponent, ComponentType } from 'react';

export interface BlockDefinition {
    type: string;
    renderer: LazyExoticComponent<ComponentType<any>>;
    editor: LazyExoticComponent<ComponentType<any>>;
}

class BlockRegistry {
    private blocks: Map<string, BlockDefinition> = new Map();

    register(definition: BlockDefinition) {
        this.blocks.set(definition.type, definition);
    }

    get(type: string): BlockDefinition | undefined {
        return this.blocks.get(type);
    }

    getAll(): BlockDefinition[] {
        return Array.from(this.blocks.values());
    }
}

export const blockRegistry = new BlockRegistry();
```

### `registerBlocks.tsx`
This file is where you actually bind the components.

```tsx
import { lazy } from 'react';
import { blockRegistry } from './BlockRegistry';

// Register a Hero block
blockRegistry.register({
    type: 'hero',
    renderer: lazy(() => import('@/components/Blocks/Hero')),
    editor: lazy(() => import('@/components/admin/PageBuilder/Editors/HeroEditor')),
});
```

---

## 🖥️ 3. Frontend Rendering

### `BlockRenderer.tsx`
The primary component used by both the public page and the preview iframe.

```tsx
import { Suspense } from 'react';
import { blockRegistry } from '@/lib/BlockRegistry';

export default function BlockRenderer({ block }) {
    const definition = blockRegistry.get(block.type);
    
    if (!definition) return <div>Unknown block type: {block.type}</div>;
    
    const Component = definition.renderer;
    
    return (
        <Suspense fallback={<div className="h-20 animate-pulse bg-muted" />}>
            <Component content={block.content} />
        </Suspense>
    );
}
```

---

## 🛠️ 4. Admin Page Builder UI

### Layout Structure
The `PageBuilder.tsx` component should split the screen:
- **Sidebar**: `BlockList` (List of blocks, reordering via `@dnd-kit`, activation).
- **Editor**: `BlockEditor` (The specific form inputs for the active block).
- **Preview**: `VisualPreview` (The iframe hosting the public page).

### Real-Time Preview Bridge
The most critical part for "User Delight."

1. **Admin Side (`VisualPreview.tsx`)**:
   ```tsx
   const iframeRef = useRef<HTMLIFrameElement>(null);
   
   useEffect(() => {
       // Send block data to iframe whenever it changes
       iframeRef.current?.contentWindow?.postMessage({
           type: 'PREVIEW_UPDATE',
           blocks: blocks
       }, window.location.origin);
   }, [blocks]);
   ```

2. **Page Side (`DynamicPage.tsx`)**:
   ```tsx
   useEffect(() => {
       const handleMessage = (event: MessageEvent) => {
           if (event.data.type === 'PREVIEW_UPDATE') {
               setBlocks(event.data.blocks); // Update local state
           }
       };
       window.addEventListener('message', handleMessage);
       return () => window.removeEventListener('message', handleMessage);
   }, []);
   ```

---

## ✅ Implementation Checklist

1. [ ] Create `Page` migration and model.
2. [ ] Set up `Admin/PageController` (CRUD) and `PageController` (Public).
3. [ ] Implement `BlockRegistry.ts` and `registerBlocks.tsx`.
4. [ ] Build the `BlockRenderer.tsx` dispatcher.
5. [ ] Create the `PageBuilder` container (Inertia/React).
6. [ ] Implement `VisualPreview` with iframe support.
7. [ ] Add `postMessage` listeners to the frontend `DynamicPage`.
8. [ ] Build your first block (Hero) and its editor.
