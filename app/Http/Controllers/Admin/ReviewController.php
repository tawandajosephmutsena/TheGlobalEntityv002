<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Http\Requests\Admin\ReviewRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request): Response
    {
        $query = Review::with(['user', 'reviewable']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('body', 'like', '%' . $request->search . '%');
        }

        $reviews = $query->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/reviews/Index', [
            'reviews' => $reviews,
            'filters' => $request->only(['status', 'search']),
            'stats' => [
                'total' => Review::count(),
                'pending' => Review::where('status', 'pending')->count(),
                'approved' => Review::where('status', 'approved')->count(),
                'rejected' => Review::where('status', 'rejected')->count(),
            ],
        ]);
    }

    /**
     * Update the specified review.
     */
    public function update(ReviewRequest $request, Review $review): RedirectResponse
    {
        $validated = $request->validated();

        $review->update($validated);

        return back()->with('success', 'Review updated successfully.');
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }

    /**
     * Approve a review.
     */
    public function approve(Review $review): RedirectResponse
    {
        $review->update(['status' => 'approved']);

        return back()->with('success', 'Review approved successfully.');
    }

    /**
     * Reject a review.
     */
    public function reject(Review $review): RedirectResponse
    {
        $review->update(['status' => 'rejected']);

        return back()->with('success', 'Review rejected successfully.');
    }
}
