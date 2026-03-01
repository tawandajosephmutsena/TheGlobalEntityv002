<?php

namespace Modules\PodcastPlugin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\PodcastPlugin\Models\PodcastCategory;

class PodcastCategoryAdminController extends Controller
{
    public function index()
    {
        $categories = PodcastCategory::withCount('podcasts')
            ->orderBy('sort_order')
            ->paginate(20);

        return Inertia::render('admin/podcast-categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
        ]);

        PodcastCategory::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, int $id)
    {
        $category = PodcastCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(int $id)
    {
        $category = PodcastCategory::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
