import AdminLayout from '@/layouts/AdminLayout';
import React from 'react';
import FestivalForm from './Form';
import { Category } from '@/types';

interface Props {
    categories: Category[];
    authors: { id: number; name: string }[];
}

export default function Create({ categories, authors }: Props) {
    return (
        <AdminLayout title="Register Festival">
            <FestivalForm categories={categories} authors={authors} />
        </AdminLayout>
    );
}
