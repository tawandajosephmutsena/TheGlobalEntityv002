<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Festival;
use App\Models\User;
use App\Models\Category;
use App\Http\Requests\Admin\FestivalRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FestivalController extends Controller
{
    /**
     * Display a listing of festivals.
     */
    public function index(Request $request): Response
    {
        $query = Festival::with(['author']);

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('slug', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'published') {
                $query->where('is_published', true);
            } elseif ($request->status === 'draft') {
                $query->where('is_published', false);
            }
        }

        $festivals = $query->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/festivals/Index', [
            'festivals' => $festivals,
            'filters' => $request->only(['search', 'status']),
            'categories' => Category::where('type', 'festival')->get(['id', 'name']),
            'stats' => [
                'total' => Festival::count(),
                'published' => Festival::where('is_published', true)->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new festival.
     */
    public function create(): Response
    {
        $authors = User::whereIn('role', ['admin', 'editor'])->get(['id', 'name']);
        $categories = Category::where('type', 'festival')->get(['id', 'name']);

        return Inertia::render('admin/festivals/Create', [
            'authors' => $authors,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created festival.
     */
    public function store(FestivalRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $festival = Festival::create($validated);

        return redirect()->route('admin.festivals.show', $festival)
            ->with('success', 'Festival created successfully.');
    }

    /**
     * Display the specified festival.
     */
    public function show(Festival $festival): Response
    {
        $festival->load(['author', 'reviews', 'activities']);

        return Inertia::render('admin/festivals/Show', [
            'festival' => $festival,
        ]);
    }

    /**
     * Show the form for editing the specified festival.
     */
    public function edit(Festival $festival): Response
    {
        $festival->load(['author']);
        $authors = User::whereIn('role', ['admin', 'editor'])->get(['id', 'name']);
        $categories = Category::where('type', 'festival')->get(['id', 'name']);

        return Inertia::render('admin/festivals/Edit', [
            'festival' => $festival,
            'authors' => $authors,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified festival.
     */
    public function update(FestivalRequest $request, Festival $festival): RedirectResponse
    {
        $validated = $request->validated();

        $festival->update($validated);

        return redirect()->route('admin.festivals.show', $festival)
            ->with('success', 'Festival updated successfully.');
    }

    /**
     * Remove the specified festival.
     */
    public function destroy(Festival $festival): RedirectResponse
    {
        $festival->delete();

        return redirect()->route('admin.festivals.index')
            ->with('success', 'Festival deleted successfully.');
    }

    /**
     * Toggle the published status.
     */
    public function togglePublished(Festival $festival): RedirectResponse
    {
        $festival->update([
            'is_published' => !$festival->is_published,
        ]);

        $status = $festival->is_published ? 'published' : 'unpublished';
        
        return back()->with('success', "Festival {$status} successfully.");
    }
}
