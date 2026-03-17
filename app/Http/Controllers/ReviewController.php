<?php

namespace App\Http\Controllers;

use App\Models\Festival;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request, Festival $festival): RedirectResponse
    {
        $validated = $request->validate([
            'body' => 'required|string|min:10',
            'vibe_rating' => 'required|integer|min:1|max:5',
            'safety_rating' => 'required|integer|min:1|max:5',
            'sustainability_rating' => 'required|integer|min:1|max:5',
        ]);

        $festival->reviews()->create([
            'user_id' => Auth::id(),
            'body' => $validated['body'],
            'vibe_rating' => $validated['vibe_rating'],
            'safety_rating' => $validated['safety_rating'],
            'sustainability_rating' => $validated['sustainability_rating'],
            'status' => 'approved', // Automatically approve for now as requested or per system default
        ]);

        return back()->with('success', 'Thank you for your review! Your magic has been shared.');
    }
}
