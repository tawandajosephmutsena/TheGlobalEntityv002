<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FestivalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('festivals')->ignore($this->festival),
            ],
            'location' => 'nullable|array',
            'location.address' => 'nullable|string',
            'location.lat' => 'nullable|numeric',
            'location.lng' => 'nullable|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'social_tags' => 'nullable|array',
            'is_published' => 'boolean',
            'author_id' => 'required|exists:users,id',
        ];
    }
}
