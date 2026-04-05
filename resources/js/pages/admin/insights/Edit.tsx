import AdminLayout from '@/layouts/AdminLayout';
import InsightForm from './Form';
import { Insight, Category, User } from '@/types';
import React from 'react';

interface Props {
    insight: Insight;
    categories: Category[];
    authors: User[];
    podcasts?: { id: number; title: string }[];
    festivals?: { id: number; name: string }[];
}

export default function Edit({ insight, categories, authors, podcasts = [], festivals = [] }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Insights', href: '/admin/insights' },
        { title: 'Edit', href: `/admin/insights/${insight.id}/edit` },
    ];

    return (
        <AdminLayout title={`Edit: ${insight.title}`} breadcrumbs={breadcrumbs}>
            <InsightForm insight={insight} categories={categories} authors={authors} podcasts={podcasts} festivals={festivals} />
        </AdminLayout>
    );
}
