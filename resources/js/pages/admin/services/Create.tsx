import AdminLayout from '@/layouts/AdminLayout';
import ServiceForm from './Form';
import { Category } from '@/types';
import React from 'react';

interface Props {
    categories: Category[];
}

export default function Create({ categories }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Services', href: '/admin/services' },
        { title: 'Create', href: '/admin/services/create' },
    ];

    return (
        <AdminLayout title="Add New Service" breadcrumbs={breadcrumbs}>
            <ServiceForm categories={categories} />
        </AdminLayout>
    );
}
