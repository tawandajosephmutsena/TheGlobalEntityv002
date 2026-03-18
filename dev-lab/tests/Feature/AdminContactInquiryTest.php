<?php

namespace Tests\Feature;

use App\Models\ContactInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContactInquiryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure roles exist if your app depends on them in isAdmin()
        // For this app, isAdmin() checks $this->role === 'admin'
    }

    public function test_admin_can_delete_inquiry(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $inquiry = ContactInquiry::factory()->create();

        $response = $this->actingAs($admin)
            ->delete(route('admin.contact-inquiries.destroy', $inquiry));

        $response->assertRedirect(route('admin.contact-inquiries.index'));
        $this->assertDatabaseMissing('contact_inquiries', ['id' => $inquiry->id]);
    }

    public function test_non_admin_cannot_delete_inquiry(): void
    {
        $user = User::factory()->create(['role' => 'viewer']);
        $inquiry = ContactInquiry::factory()->create();

        $response = $this->actingAs($user)
            ->delete(route('admin.contact-inquiries.destroy', $inquiry));

        $response->assertStatus(403);
        $this->assertDatabaseHas('contact_inquiries', ['id' => $inquiry->id]);
    }

    public function test_unauthenticated_user_is_redirected_to_login(): void
    {
        $inquiry = ContactInquiry::factory()->create();

        $response = $this->delete(route('admin.contact-inquiries.destroy', $inquiry));

        // When not authenticated, it should redirect to login.
        // Inertia (via standard auth middleware) should handle this correctly.
        $response->assertRedirect('/login');
    }
}
