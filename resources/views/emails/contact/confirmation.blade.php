<x-mail::message>
# Thank you for contacting us!

Hello {{ $contactData['name'] ?? 'there' }},

We have received your submission for **{{ $contactData['form_title'] ?? 'our inquiry form' }}**.

A member of our team will review your details and get back to you as soon as possible.

## Your Submission Summary

@foreach($contactData as $key => $value)
@if(!in_array($key, ['admin_email', 'allow_multiple_submissions', 'form_title']))
**{{ ucfirst(str_replace('_', ' ', $key)) }}:** {{ is_array($value) ? implode(', ', $value) : $value }}
@endif
@endforeach

If you need to add anything else or have urgent questions, feel free to reply to this email.

Best regards,<br>
The {{ config('app.name') }} Team
</x-mail::message>
