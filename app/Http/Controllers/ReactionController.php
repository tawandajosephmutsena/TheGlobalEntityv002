<?php

namespace App\Http\Controllers;

use App\Models\Reaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ReactionController extends Controller
{
    /**
     * Toggle a reaction on a reactable model.
     */
    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reactable_id' => 'required|integer',
            'reactable_type' => 'required|string|in:insight,comment',
            'type' => 'required|string|in:' . implode(',', Reaction::TYPES),
        ]);

        $modelMap = [
            'insight' => \App\Models\Insight::class,
            'comment' => \App\Models\Comment::class,
        ];

        $reactableType = $modelMap[$validated['reactable_type']];
        $reactableId = $validated['reactable_id'];
        $userId = $request->user()->id;

        // Check if user already has a reaction on this item
        $existing = Reaction::where('user_id', $userId)
            ->where('reactable_id', $reactableId)
            ->where('reactable_type', $reactableType)
            ->first();

        if ($existing) {
            if ($existing->type === $validated['type']) {
                // Same reaction type = un-react
                $existing->delete();
                $action = 'removed';
            } else {
                // Different reaction type = switch
                $existing->update(['type' => $validated['type']]);
                $action = 'updated';
            }
        } else {
            // New reaction
            Reaction::create([
                'user_id' => $userId,
                'reactable_id' => $reactableId,
                'reactable_type' => $reactableType,
                'type' => $validated['type'],
            ]);
            $action = 'added';
        }

        // Get updated counts
        $counts = Reaction::where('reactable_id', $reactableId)
            ->where('reactable_type', $reactableType)
            ->selectRaw('type, count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        $userReaction = Reaction::where('user_id', $userId)
            ->where('reactable_id', $reactableId)
            ->where('reactable_type', $reactableType)
            ->value('type');

        return response()->json([
            'action' => $action,
            'counts' => $counts,
            'user_reaction' => $userReaction,
        ]);
    }
}
