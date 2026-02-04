import React from 'react';

export interface BlockDefinition {
    type: string;
    label: string;
    icon: React.ReactNode;
    desc: string;
    category: string;
    renderer: React.ComponentType<any>;
    editor: React.ComponentType<any>;
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

    getCategories(): string[] {
        return Array.from(new Set(this.getAll().map(b => b.category)));
    }
}

export const blockRegistry = new BlockRegistry();
