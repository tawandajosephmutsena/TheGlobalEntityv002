import { usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

interface User {
    id: number;
    name: string;
    email: string;
    roles?: { slug: string; name?: string }[];
    permissions?: Record<string, Record<string, boolean>>;
    is_super_admin?: boolean;
    // Include existing fields if necessary
    [key: string]: any;
}

interface AuthInfo {
    user: User;
}

interface IndexProps extends PageProps {
    auth: AuthInfo;
}

export function usePermissions() {
    const { auth } = usePage<IndexProps>().props;
    const user = auth.user;

    /**
     * Check if the user has a specific role
     */
    const hasRole = (roleParams: string | string[]) => {
        if (!user || (!user.roles && !user.is_super_admin)) return false;
        if (user.is_super_admin) return true;

        const roles = Array.isArray(roleParams) ? roleParams : [roleParams];
        return user.roles?.some((r: any) => roles.includes(r.slug)) || false;
    };

    /**
     * Check if user has specific capability on a resource/collection
     * Usage: hasCapability('festivals', 'publish')
     */
    const hasCapability = (resource: string, action: string) => {
        if (!user) return false;
        
        // Super admin bypass
        if (user.is_super_admin) return true;

        // Structured capabilities: { "festivals": { "can_create": true } }
        const resourcePerms = user.permissions?.[resource];
        if (!resourcePerms) return false;

        return resourcePerms[`can_${action}`] === true;
    };

    /**
     * Legacy generic check (maps to resource.action format if passed explicitly)
     * e.g. hasPermission('festivals.create')
     */
    const hasPermission = (permission: string) => {
        if (!user) return false;
        if (user.is_super_admin) return true;

        const parts = permission.split('.');
        if (parts.length === 2) {
            return hasCapability(parts[0], parts[1]);
        }
        
        return false;
    };

    /**
     * Check if user can perform an action (alias)
     */
    const can = (permission: string) => hasPermission(permission);

    return { hasRole, hasCapability, hasPermission, can, user };
}
