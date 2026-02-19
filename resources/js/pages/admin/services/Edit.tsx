import AdminLayout from '@/layouts/AdminLayout';
import ServiceForm from './Form';
import { Service, Category } from '@/types';
import React from 'react';

interface Props {
    service: Service;
    categories: Category[];
}

export default function Edit({ service, categories }: Props) {
    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Services', href: '/admin/services' },
        { title: 'Edit', href: `/admin/services/${service.id}/edit` },
    ];

    return (
        <AdminLayout title={`Edit: ${service.title}`} breadcrumbs={breadcrumbs}>
            <ServiceForm service={service} categories={categories} />
        </AdminLayout>
    );
}
