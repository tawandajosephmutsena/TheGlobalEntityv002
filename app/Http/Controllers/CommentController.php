<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Insight;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
    /**
     * Store a new comment.
     */
    public function store(Request $request, Insight $insight): RedirectResponse
    {
        $validated = $request->validate([
            'body' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $insight->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        return back()->with('success', 'Comment posted successfully.');
    }

    /**
     * Delete a comment (author or admin).
     */
    public function destroy(Request $request, Comment $comment): RedirectResponse
    {
        $user = $request->user();

        if ($comment->user_id !== $user->id && !$user->isAdmin()) {
            abort(403, 'Unauthorized.');
        }

        $comment->delete();

        return back()->with('success', 'Comment deleted.');
    }
}
