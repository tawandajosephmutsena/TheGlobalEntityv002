import AdminLayout from '@/layouts/AdminLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/react';
import { MessageSquare, Eye, Trash2, Mail, Calendar, Download, MoreHorizontal, CheckCircle, Navigation } from 'lucide-react';
import React, { useState } from 'react';
import { PaginatedData } from '@/types';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ContactInquiry {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    created_at: string;
}

interface Stats {
    total: number;
    new: number;
    replied: number;
}

interface Props {
    inquiries: PaginatedData<ContactInquiry>;
    stats: Stats;
    forms: { label: string; value: string }[];
    currentForm: string | null;
}

export default function ContactInquiriesIndex({ inquiries, stats, forms, currentForm }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Inquiries', href: '/admin/contact-inquiries' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this inquiry?')) {
            router.delete(`/admin/contact-inquiries/${id}`);
        }
    };

    const handleBulkAction = (action: string) => {
        if (selectedIds.length === 0) return;
        
        let confirmMessage = 'Are you sure you want to perform this action?';
        if (action === 'delete') confirmMessage = 'Are you sure you want to delete the selected inquiries?';

        if (confirm(confirmMessage)) {
            router.post('/admin/contact-inquiries/bulk-action', {
                ids: selectedIds,
                action: action,
            }, {
                onSuccess: () => setSelectedIds([]) // Clear selection on success
            });
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === inquiries.data.length && inquiries.data.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(inquiries.data.map(i => i.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const exportCSV = () => {
        const rowsToExport = inquiries.data.filter(i => selectedIds.includes(i.id));
        if (rowsToExport.length === 0) return;

        const headers = ['ID', 'Name', 'Email', 'Subject', 'Status', 'Date'];
        const csvRows = [
            headers.join(','), // header row
            ...rowsToExport.map(row => [
                row.id,
                `"${row.name.replace(/"/g, '""')}"`,
                `"${row.email.replace(/"/g, '""')}"`,
                `"${row.subject.replace(/"/g, '""')}"`,
                row.status,
                new Date(row.created_at).toLocaleDateString()
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'inquiries_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportPDF = () => {
        const rowsToExport = inquiries.data.filter(i => selectedIds.includes(i.id));
        if (rowsToExport.length === 0) return;

        const doc = new jsPDF();
        doc.text('Contact Inquiries Export', 14, 15);
        
        autoTable(doc, {
            startY: 20,
            head: [['Name', 'Email', 'Subject', 'Status', 'Date']],
            body: rowsToExport.map(row => [
                row.name,
                row.email,
                row.subject,
                row.status,
                new Date(row.created_at).toLocaleDateString()
            ]),
        });

        doc.save('inquiries_export.pdf');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <Badge variant="destructive">New</Badge>;
            case 'read': return <Badge variant="secondary">Read</Badge>;
            case 'replied': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Replied</Badge>;
            case 'archived': return <Badge variant="outline">Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AdminLayout title="Contact Inquiries" breadcrumbs={breadcrumbs}>
            <ErrorBoundary>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
                        <p className="text-muted-foreground">
                            Manage and respond to messages from your website visitors.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {forms && forms.length > 0 && (
                        <div className="w-full overflow-x-auto pb-2">
                            <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                                <button 
                                    onClick={() => router.get('/admin/contact-inquiries', {}, { preserveState: true })}
                                    className={cn(
                                        "inline-flex h-[calc(100%-1px)] items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                        (!currentForm || currentForm === 'all') 
                                            ? "bg-background text-foreground shadow-sm" 
                                            : "hover:bg-background/50 hover:text-foreground"
                                    )}
                                >
                                    All Inquiries
                                </button>
                                {forms.map(form => (
                                    <button 
                                        key={form.value}
                                        onClick={() => router.get(`/admin/contact-inquiries?form_name=${encodeURIComponent(form.value)}`, {}, { preserveState: true })}
                                        className={cn(
                                            "inline-flex h-[calc(100%-1px)] items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                            currentForm === form.value 
                                                ? "bg-background text-foreground shadow-sm" 
                                                : "hover:bg-background/50 hover:text-foreground"
                                        )}
                                    >
                                        {form.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                            <MessageSquare className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                All time messages
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
                            <Mail className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.new ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Unread inquiries
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Replied</CardTitle>
                            <CheckCircle className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.replied ?? 0}</div>
                            <p className="text-xs text-muted-foreground">
                                Successfully addressed
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Toolbar */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-border">
                        <span className="text-sm font-medium px-2">
                            {selectedIds.length} selected
                        </span>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-auto">
                                    <MoreHorizontal className="size-4 mr-2" />
                                    Bulk Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleBulkAction('mark_read')}>
                                    <Eye className="size-4 mr-2" /> Mark as Read
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkAction('mark_replied')}>
                                    <Navigation className="size-4 mr-2" /> Mark as Replied
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => handleBulkAction('delete')}
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                >
                                    <Trash2 className="size-4 mr-2" /> Delete Selected
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="h-4 w-px bg-border mx-1" />

                        <Button variant="outline" size="sm" onClick={exportCSV}>
                            <Download className="size-4 mr-2" />
                            CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportPDF}>
                            <Download className="size-4 mr-2" />
                            PDF
                        </Button>
                    </div>
                )}

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="p-4 w-12">
                                            <Checkbox 
                                                checked={selectedIds.length === inquiries.data.length && inquiries.data.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all"
                                            />
                                        </th>
                                        <th className="p-4 font-bold">Contact</th>
                                        <th className="p-4 font-bold">Subject</th>
                                        <th className="p-4 font-bold">Status</th>
                                        <th className="p-4 font-bold">Date</th>
                                        <th className="p-4 text-right font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.data.length > 0 ? (
                                        inquiries.data.map((inquiry) => (
                                            <tr 
                                                key={inquiry.id} 
                                                className={cn(
                                                    "border-b transition-colors hover:bg-muted/30",
                                                    selectedIds.includes(inquiry.id) && "bg-muted/50"
                                                )}
                                            >
                                                <td className="p-4">
                                                    <Checkbox 
                                                        checked={selectedIds.includes(inquiry.id)}
                                                        onCheckedChange={() => toggleSelect(inquiry.id)}
                                                        aria-label={`Select inquiry from ${inquiry.name}`}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold">{inquiry.name}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Mail className="size-3" /> {inquiry.email}
                                                    </div>
                                                </td>
                                                <td className="p-4 max-w-xs truncate font-medium">
                                                    {inquiry.subject}
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(inquiry.status)}
                                                </td>
                                                <td className="p-4 text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="size-3" /> {new Date(inquiry.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/contact-inquiries/${inquiry.id}`}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDelete(inquiry.id)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <MessageSquare className="size-8 opacity-20" />
                                                    <p>No inquiries found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {inquiries.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {inquiries.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={cn(
                                    "px-4 py-2 text-sm rounded-md transition-colors",
                                    link.active ? "bg-agency-accent text-agency-primary font-bold" : "bg-muted hover:bg-muted/80 text-muted-foreground",
                                    !link.url && "opacity-50 cursor-not-allowed"
                                )}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(link.label) }}
                            />
                        ))}
                    </div>
                )}
            </div>
            </ErrorBoundary>
        </AdminLayout>
    );
}
