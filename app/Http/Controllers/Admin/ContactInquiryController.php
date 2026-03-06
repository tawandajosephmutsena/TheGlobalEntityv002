<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class ContactInquiryController extends Controller
{
    /**
     * Build the base query with all applicable filters.
     */
    private function applyFilters(Request $request)
    {
        $query = ContactInquiry::latest();

        if ($request->filled('form_name')) {
            $query->where('form_name', $request->query('form_name'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->query('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->query('date_to'));
        }

        return $query;
    }

    /**
     * Display a listing of the inquiries.
     */
    public function index(Request $request)
    {
        $currentForm = $request->query('form_name');

        // Extract available forms by fetching distinct form_name with their counts
        $forms = ContactInquiry::selectRaw("form_name, COUNT(*) as total_count, SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count")
            ->whereNotNull('form_name')
            ->groupBy('form_name')
            ->get()
            ->map(function ($form) {
                return [
                    'label' => $form->form_name,
                    'value' => $form->form_name,
                    'count' => (int) $form->total_count,
                    'new_count' => (int) $form->new_count,
                ];
            })
            ->sortBy('label')
            ->values()
            ->all();

        $query = $this->applyFilters($request);

        $totalFiltered = $query->count();

        $inquiries = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => ContactInquiry::when($currentForm, fn($q) => $q->where('form_name', $currentForm))->count(),
            'new' => ContactInquiry::when($currentForm, fn($q) => $q->where('form_name', $currentForm))->where('status', 'new')->count(),
            'replied' => ContactInquiry::when($currentForm, fn($q) => $q->where('form_name', $currentForm))->where('status', 'replied')->count(),
        ];

        $filters = [
            'search' => $request->query('search', ''),
            'status' => $request->query('status', ''),
            'date_from' => $request->query('date_from', ''),
            'date_to' => $request->query('date_to', ''),
        ];

        return Inertia::render('admin/contact-inquiries/Index', [
            'inquiries' => $inquiries,
            'stats' => $stats,
            'forms' => $forms,
            'currentForm' => $currentForm,
            'filters' => $filters,
            'totalFiltered' => $totalFiltered,
        ]);
    }

    /**
     * Display the specified inquiry.
     */
    public function show(ContactInquiry $contactInquiry)
    {
        if ($contactInquiry->status === 'new') {
            $contactInquiry->update(['status' => 'read']);
        }

        return Inertia::render('admin/contact-inquiries/Show', [
            'inquiry' => $contactInquiry
        ]);
    }

    /**
     * Update the status of an inquiry.
     */
    public function update(Request $request, ContactInquiry $contactInquiry)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:new,read,replied,archived',
        ]);

        $contactInquiry->update($validated);

        return back()->with('success', 'Inquiry status updated.');
    }

    /**
     * Remove the specified inquiry from storage.
     */
    public function destroy(ContactInquiry $contactInquiry)
    {
        $contactInquiry->delete();

        return redirect()->route('admin.contact-inquiries.index')
            ->with('success', 'Inquiry deleted successfully.');
    }

    /**
     * Perform bulk actions on multiple inquiries.
     */
    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required_without:select_all_filtered|array',
            'ids.*' => 'exists:contact_inquiries,id',
            'action' => 'required|string|in:mark_read,mark_replied,archive,delete',
            'select_all_filtered' => 'sometimes|boolean',
            // Filter params for select-all-filtered
            'form_name' => 'sometimes|string|nullable',
            'search' => 'sometimes|string|nullable',
            'status_filter' => 'sometimes|string|nullable',
            'date_from' => 'sometimes|string|nullable',
            'date_to' => 'sometimes|string|nullable',
        ]);

        if (!empty($validated['select_all_filtered'])) {
            // Build query from filters
            $inquiries = ContactInquiry::latest();

            if (!empty($validated['form_name'])) {
                $inquiries->where('form_name', $validated['form_name']);
            }
            if (!empty($validated['search'])) {
                $search = $validated['search'];
                $inquiries->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%")
                      ->orWhere('message', 'like', "%{$search}%");
                });
            }
            if (!empty($validated['status_filter'])) {
                $inquiries->where('status', $validated['status_filter']);
            }
            if (!empty($validated['date_from'])) {
                $inquiries->whereDate('created_at', '>=', $validated['date_from']);
            }
            if (!empty($validated['date_to'])) {
                $inquiries->whereDate('created_at', '<=', $validated['date_to']);
            }
        } else {
            $inquiries = ContactInquiry::whereIn('id', $validated['ids']);
        }

        switch ($validated['action']) {
            case 'mark_read':
                $inquiries->update(['status' => 'read']);
                $message = 'Selected inquiries marked as read.';
                break;
            case 'mark_replied':
                $inquiries->update(['status' => 'replied']);
                $message = 'Selected inquiries marked as replied.';
                break;
            case 'archive':
                $inquiries->update(['status' => 'archived']);
                $message = 'Selected inquiries archived.';
                break;
            case 'delete':
                $inquiries->delete();
                $message = 'Selected inquiries deleted successfully.';
                break;
        }

        return back()->with('success', $message ?? 'Bulk action completed.');
    }

    /**
     * Export filtered inquiries as CSV.
     */
    public function exportFiltered(Request $request): StreamedResponse
    {
        $query = $this->applyFilters($request);

        // If specific IDs are provided, limit to those
        if ($request->filled('ids')) {
            $ids = explode(',', $request->query('ids'));
            $query->whereIn('id', $ids);
        }

        $filename = 'inquiries_export_' . date('Y-m-d_His') . '.csv';

        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Email', 'Subject', 'Form', 'Type', 'Message', 'Additional Data', 'Status', 'Date']);

            $query->chunk(500, function ($inquiries) use ($handle) {
                foreach ($inquiries as $inquiry) {
                    $metadata = '';
                    if (!empty($inquiry->metadata['formatted_fields'])) {
                        $metadata = collect($inquiry->metadata['formatted_fields'])
                            ->map(fn($v, $k) => "$k: " . (is_array($v) ? implode(', ', $v) : $v))
                            ->implode(' | ');
                    }

                    fputcsv($handle, [
                        $inquiry->id,
                        $inquiry->name,
                        $inquiry->email,
                        $inquiry->subject,
                        $inquiry->form_name,
                        $inquiry->type,
                        $inquiry->message,
                        $metadata,
                        $inquiry->status,
                        $inquiry->created_at->format('Y-m-d H:i:s'),
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    /**
     * Export filtered inquiries as PDF.
     */
    public function exportPdfFiltered(Request $request)
    {
        $query = $this->applyFilters($request);

        // If specific IDs are provided, limit to those
        if ($request->filled('ids')) {
            $ids = explode(',', $request->query('ids'));
            $query->whereIn('id', $ids);
        }

        $inquiries = $query->get();

        $pdf = Pdf::loadView('admin.exports.inquiries-pdf', [
            'inquiries' => $inquiries
        ]);

        return $pdf->download('inquiries_export_' . date('Y-m-d_His') . '.pdf');
    }
}
