<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
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
            'vibe_rating' => 'required|integer|min:1|max:5',
            'safety_rating' => 'required|integer|min:1|max:5',
            'sustainability_rating' => 'required|integer|min:1|max:5',
            'body' => 'nullable|string',
            'status' => 'required|in:pending,approved,rejected',
        ];
    }
}
