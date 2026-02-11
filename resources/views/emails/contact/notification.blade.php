<x-mail::message>
# New Form Submission

You have received a new submission from the **{{ $contactData['form_title'] ?? 'Contact Form' }}**.

## Submission Details

@foreach($contactData as $key => $value)
@if(!in_array($key, ['admin_email', 'allow_multiple_submissions', 'form_title']))
**{{ ucfirst(str_replace('_', ' ', $key)) }}:** {{ is_array($value) ? implode(', ', $value) : $value }}
@endif
@endforeach

<x-mail::button :url="config('app.url') . '/admin/contacts'">
View in Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
