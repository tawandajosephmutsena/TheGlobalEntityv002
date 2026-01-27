import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import GlobalAppearanceSetting from '@/components/admin/GlobalAppearanceSetting';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const isSuperAdmin = auth.user?.is_super_admin;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />

                    {isSuperAdmin && (
                        <div className="pt-6 border-t">
                            <GlobalAppearanceSetting />
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
