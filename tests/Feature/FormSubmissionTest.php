<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\ContactInquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactSubmissionNotification;
use App\Mail\ContactConfirmation;

class FormSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_form_submission_sends_emails_and_stores_data(): void
    {
        Mail::fake();

        $response = $this->post('/contact', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'Hello test',
            'form_title' => 'Test Form',
            'admin_email' => 'admin@test.com',
            'allow_multiple_submissions' => true
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('contact_inquiries', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'subject' => 'Test Form Submission'
        ]);

        Mail::assertSent(ContactConfirmation::class, function ($mail) {
            return $mail->hasTo('john@example.com') && 
                   $mail->contactData['name'] === 'John Doe';
        });

        Mail::assertSent(ContactSubmissionNotification::class, function ($mail) {
            return $mail->hasTo('admin@test.com') && 
                   $mail->contactData['form_title'] === 'Test Form';
        });
    }

    public function test_form_submission_respects_multiple_submission_restriction(): void
    {
        Mail::fake();

        // First submission
        $this->post('/contact', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'form_title' => 'Limited Form',
            'allow_multiple_submissions' => false
        ]);

        $this->assertEquals(1, ContactInquiry::count());

        // Second submission with same email and form title
        $response = $this->post('/contact', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'form_title' => 'Limited Form',
            'allow_multiple_submissions' => false
        ]);

        $response->assertSessionHasErrors(['message']);
        $this->assertEquals(1, ContactInquiry::count());
        
        // Second submission to DIFFERENT form title should be allowed
        $this->post('/contact', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'form_title' => 'Another Form',
            'allow_multiple_submissions' => false
        ]);

        $this->assertEquals(2, ContactInquiry::count());
    }
}
