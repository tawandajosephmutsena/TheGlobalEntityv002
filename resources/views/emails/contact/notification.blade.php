<x-mail::message>
# New Form Submission

You have received a new submission from the **{{ $contactData['form_title'] ?? 'Contact Form' }}**.

## Submission Details

@if(isset($contactData['summary']) && count($contactData['summary']) > 0)
@foreach($contactData['summary'] as $label => $value)
**{{ $label }}:** {{ is_array($value) ? implode(', ', $value) : $value }}<br>
@endforeach
@endif

<x-mail::button :url="config('app.url') . '/admin/contacts'">
View in Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
