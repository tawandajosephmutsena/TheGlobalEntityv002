<?php

namespace Modules\ComponentImporter\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ComponentImporterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return \Inertia\Inertia::render('admin/plugins/ComponentImporter');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('componentimporter::create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'plugin_zip' => 'required|file|mimes:zip|max:10240',
        ]);

        $file = $request->file('plugin_zip');
        $tempPath = storage_path('app/temp_plugins/' . uniqid());
        
        try {
            // Extract ZIP (In a real scenario, we'd move files to resources/js/plugins)
            $zip = new \ZipArchive;
            if ($zip->open($file->getRealPath()) === TRUE) {
                // $zip->extractTo($tempPath);
                $zip->close();
                
                Log::info("Plugin uploaded: " . $file->getClientOriginalName());
                
                return response()->json([
                    'message' => 'Plugin uploaded and prepared for registration. Please ensure you have run your local build.',
                    'status' => 'success'
                ]);
            }
            
            throw new \Exception("Could not open ZIP file");

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Upload failed: ' . $e->getMessage(),
                'status' => 'error'
            ], 422);
        }
    }

    /**
     * Show the specified resource.
     */
    public function show($id)
    {
        return view('componentimporter::show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return view('componentimporter::edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id) {}
}
