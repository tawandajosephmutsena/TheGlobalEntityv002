import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FolderOpen,
    Briefcase,
    FileText,
    Users,
    Image,
    Settings,
    Home,
    MessageSquare,
    BookOpen,
    List,
    TrendingUp,
    Shield,
    Palette,
    Package,
    Tags,
    Mic,
    Map,
    Star,
} from 'lucide-react';

import { usePermissions } from '@/hooks/use-permissions';

import AppLogo from '@/components/app-logo';

const mainNavItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: TrendingUp,
        capability: ['settings', 'read'], // Restricted to those who can manage settings/admin level
    },
];

const contentNavItems = [
    {
        title: 'Portfolio',
        href: '/admin/portfolio',
        icon: FolderOpen,
        capability: ['portfolio_items', 'read'],
    },
    {
        title: 'Services',
        href: '/admin/services',
        icon: Briefcase,
        capability: ['services', 'read'],
    },
    {
        title: 'Insights',
        href: '/admin/insights',
        icon: FileText,
        capability: ['insights', 'read'],
    },
    {
        title: 'Team',
        href: '/admin/team',
        icon: Users,
        // Assuming team maps to users or a separate capability, let's use users.read
        capability: ['users', 'read'],
    },
    {
        title: 'Pages',
        href: '/admin/pages',
        icon: LayoutDashboard,
        capability: ['pages', 'read'],
    },
    {
        title: 'Menus',
        href: '/admin/menus',
        icon: List,
        // Assuming menus map to pages or settings, we use settings.read
        capability: ['settings', 'read'],
    },
    {
        title: 'Inquiries',
        href: '/admin/contact-inquiries',
        icon: MessageSquare,
        capability: ['settings', 'read'], // Assuming settings/admin level
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Tags,
        capability: ['categories', 'read'],
    },
    {
        title: 'Podcasts',
        href: '/admin/podcasts',
        icon: Mic,
        capability: ['insights', 'read'], // Binding to insights for now
    },
];

const tgeNavItems = [
    {
        title: 'Festivals',
        href: '/admin/festivals',
        icon: Map,
        capability: ['festivals', 'read'],
    },
    {
        title: 'Reviews',
        href: '/admin/reviews',
        icon: Star,
        capability: ['reviews', 'read'],
    },
];


const systemNavItems = [
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        capability: ['users', 'read'],
    },
    {
        title: 'Roles',
        href: '/admin/roles',
        icon: Shield,
        capability: ['users', 'read'], // Roles maps roughly to user admin
    },
    {
        title: 'Media Library',
        href: '/admin/media',
        icon: Image,
        capability: ['media', 'read'],
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        capability: ['settings', 'read'],
    },
    {
        title: 'Branding',
        href: '/admin/settings?tab=theme', 
        icon: Palette,
        capability: ['settings', 'read'],
    },
    {
        title: 'Plugins',
        href: '/admin/plugins/component-importer',
        icon: Package,
        capability: ['settings', 'read'],
    },
];


const quickNavItems = [
    {
        title: 'View Site',
        href: '/',
        icon: Home,
    },
    {
        title: 'Documentation',
        href: '/documentation',
        icon: BookOpen,
    },
];

export function AdminSidebar() {
    const { url } = usePage();
    const { hasRole, hasCapability } = usePermissions();


    const isActive = (href: string) => {
        if (href === '/admin' || href === '/dashboard') {
            return url === '/admin' || url === '/dashboard';
        }
        return url.startsWith(href);
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" className="flex items-center justify-center bg-transparent">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.filter((item: any) => !item.capability || hasCapability(item.capability[0], item.capability[1])).map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.href)}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Content Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>Content</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {contentNavItems.filter((item: any) => !item.capability || hasCapability(item.capability[0], item.capability[1])).map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.href)}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Global Entity Platform */}
                {tgeNavItems.filter((item: any) => !item.capability || hasCapability(item.capability[0], item.capability[1])).length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Global Entity</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {tgeNavItems.filter((item: any) => !item.capability || hasCapability(item.capability[0], item.capability[1])).map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive(item.href)}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* System Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>System</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {systemNavItems.filter((item: any) => !item.capability || hasCapability(item.capability[0], item.capability[1])).map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.href)}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Quick Actions */}
                <SidebarGroup>
                    <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {quickNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                    >
                                        <Link href={item.href} target="_blank">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}