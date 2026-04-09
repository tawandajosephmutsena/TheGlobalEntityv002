<?php

namespace App\Services\Dashboard\Sources;

use App\Models\ContactInquiry;
use App\Services\Dashboard\BaseDashboardSource;

class ContactInquirySource extends BaseDashboardSource
{
    protected function getModelClass(): string
    {
        return ContactInquiry::class;
    }

    public function getKey(): string
    {
        return 'contact_inquiries';
    }

    public function getLabel(): string
    {
        return 'Inquiries';
    }

    public function getIcon(): string
    {
        return 'MessageSquare';
    }

    public function getColor(): string
    {
        return '#f43f5e'; // rose-500
    }

    public function getOverviewStats(): array
    {
        $total = ContactInquiry::count();
        $unread = ContactInquiry::whereIn('status', ['new', 'read'])->count();
        $new = ContactInquiry::where('status', 'new')->count();

        return [
            'total' => $total,
            'badges' => [
                ['label' => 'unread', 'value' => $unread, 'colorClass' => 'bg-blue-500/15 text-blue-400 border-blue-500/20'],
                ['label' => 'new', 'value' => $new, 'colorClass' => 'bg-rose-500/15 text-rose-400 border-rose-500/20']
            ],
            'href' => '/admin/contact-inquiries',
        ];
    }
}
