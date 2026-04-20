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
        $this->authorize('viewAny', Festival::class);

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
        $this->authorize('create', Festival::class);

        // Fetch authors - ideally those who can create or manage festivals
        $authors = User::whereHas('roles', function($q) {
            $q->whereIn('slug', ['admin', 'editor', 'festival_organizer']);
        })->get(['id', 'name']);
        
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
        $this->authorize('create', Festival::class);

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
        $this->authorize('view', $festival);

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
        $this->authorize('update', $festival);

        $festival->load(['author']);
        $authors = User::whereHas('roles', function($q) {
            $q->whereIn('slug', ['admin', 'editor', 'festival_organizer']);
        })->get(['id', 'name']);
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
        $this->authorize('update', $festival);

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
        $this->authorize('delete', $festival);

        $festival->delete();

        return redirect()->route('admin.festivals.index')
            ->with('success', 'Festival deleted successfully.');
    }

    /**
     * Toggle the published status.
     */
    public function togglePublished(Festival $festival): RedirectResponse
    {
        // Require specific unpublish/publish capability
        $action = $festival->is_published ? 'unpublish' : 'publish';
        $this->authorize($action, $festival);

        $festival->update([
            'is_published' => !$festival->is_published,
        ]);

        $status = $festival->is_published ? 'published' : 'unpublished';
        
        return back()->with('success', "Festival {$status} successfully.");
    }
}
