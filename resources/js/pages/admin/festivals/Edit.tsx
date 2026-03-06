import AdminLayout from '@/layouts/AdminLayout';
import React from 'react';
import FestivalForm from './Form';
import { Category } from '@/types';

interface Props {
    festival: any;
    categories: Category[];
    authors: { id: number; name: string }[];
}

export default function Edit({ festival, categories, authors }: Props) {
    return (
        <AdminLayout title="Update Festival">
            <FestivalForm festival={festival} categories={categories} authors={authors} />
        </AdminLayout>
    );
}
