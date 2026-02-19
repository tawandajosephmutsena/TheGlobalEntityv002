import AdminLayout from '@/layouts/AdminLayout';
import PortfolioForm from './Form';
import { Category } from '@/types';
import React from 'react';

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Portfolio', href: '/admin/portfolio' },
        { title: 'Create', href: '/admin/portfolio/create' },
    ];

    return (
        <AdminLayout title="Add New Project" breadcrumbs={breadcrumbs}>
            <PortfolioForm categories={categories} />
        </AdminLayout>
    );
}
