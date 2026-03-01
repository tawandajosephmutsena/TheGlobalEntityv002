<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactInquiryController extends Controller
{
    /**
     * Display a listing of the inquiries.
     */
    public function index(Request $request)
    {
        $currentForm = $request->query('form_subject');

        // Extract available forms by splitting " Submission" from subject
        $forms = ContactInquiry::select('subject')
            ->distinct()
            ->whereNotNull('subject')
            ->get()
            ->map(function ($inquiry) {
                // Return 'label' without " Submission" and 'value' as the literal db subject
                $label = preg_replace('/ Submission$/', '', $inquiry->subject);
                return [
                    'label' => $label,
                    'value' => $inquiry->subject
                ];
            })
            ->sortBy('label')
            ->values()
            ->all();

        $query = ContactInquiry::latest();

        if ($currentForm) {
            $query->where('subject', $currentForm);
        }

        $inquiries = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => ContactInquiry::when($currentForm, fn($q) => $q->where('subject', $currentForm))->count(),
            'new' => ContactInquiry::when($currentForm, fn($q) => $q->where('subject', $currentForm))->where('status', 'new')->count(),
            'replied' => ContactInquiry::when($currentForm, fn($q) => $q->where('subject', $currentForm))->where('status', 'replied')->count(),
        ];

        return Inertia::render('admin/contact-inquiries/Index', [
            'inquiries' => $inquiries,
            'stats' => $stats,
            'forms' => $forms,
            'currentForm' => $currentForm
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
            'ids' => 'required|array',
            'ids.*' => 'exists:contact_inquiries,id',
            'action' => 'required|string|in:mark_read,mark_replied,delete',
        ]);

        $inquiries = ContactInquiry::whereIn('id', $validated['ids']);

        switch ($validated['action']) {
            case 'mark_read':
                $inquiries->update(['status' => 'read']);
                $message = 'Selected inquiries marked as read.';
                break;
            case 'mark_replied':
                $inquiries->update(['status' => 'replied']);
                $message = 'Selected inquiries marked as replied.';
                break;
            case 'delete':
                $inquiries->delete();
                $message = 'Selected inquiries deleted successfully.';
                break;
        }

        return back()->with('success', $message ?? 'Bulk action completed.');
    }
}
