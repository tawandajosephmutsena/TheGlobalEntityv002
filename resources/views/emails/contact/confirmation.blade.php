<x-mail::message>
@if(!empty($contactData['custom_confirmation_body']))
{!! $contactData['custom_confirmation_body'] !!}
@else
# Thank you for contacting us!

Hello {{ $contactData['name'] ?? 'there' }},

We have received your submission for **{{ $contactData['form_title'] ?? 'our inquiry form' }}**.

A member of our team will review your details and get back to you as soon as possible.
@endif

@if(isset($contactData['summary']) && count($contactData['summary']) > 0)
## Your Submission Summary

@foreach($contactData['summary'] as $label => $value)
**{{ $label }}:** {{ is_array($value) ? implode(', ', $value) : $value }}<br>
@endforeach
@endif

@if(empty($contactData['custom_confirmation_body']))
If you need to add anything else or have urgent questions, feel free to reply to this email.

Best regards,<br>
The {{ config('app.name') }} Team
@endif
</x-mail::message>
