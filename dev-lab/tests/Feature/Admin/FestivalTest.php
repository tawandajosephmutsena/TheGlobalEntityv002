<?php
    
namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Festival;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FestivalTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_create_festival()
    {
        $category = Category::create([
            'name' => 'Music Festivals',
            'slug' => 'music-festivals',
            'type' => 'portfolio',
        ]);
        
        $data = [
            'name' => 'Tomorrowland 2026',
            'description' => 'Electronic dance music festival.',
            'slug' => 'tomorrowland-2026',
            'type' => 'EDM',
            'location' => [
                'address' => 'Boom, Belgium',
                'lat' => 51.091,
                'lng' => 4.368,
            ],
            'start_date' => '2026-07-20',
            'end_date' => '2026-07-30',
            'social_tags' => ['music', 'festival'],
            'is_published' => true,
            'author_id' => $this->admin->id,
            'category_id' => $category->id,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.festivals.store'), $data);

        $response->assertStatus(302);
        $this->assertDatabaseHas('festivals', [
            'name' => 'Tomorrowland 2026',
            'type' => 'EDM',
            'author_id' => $this->admin->id,
        ]);
    }

    public function test_end_date_must_be_after_start_date()
    {
        $data = [
            'name' => 'Invalid Festival',
            'slug' => 'invalid-festival',
            'start_date' => '2026-07-30',
            'end_date' => '2026-07-20',
            'author_id' => $this->admin->id,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.festivals.store'), $data);

        $response->assertSessionHasErrors(['end_date']);
    }

    public function test_author_id_is_required()
    {
        $data = [
            'name' => 'No Author Festival',
            'slug' => 'no-author-festival',
            'author_id' => '',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.festivals.store'), $data);

        $response->assertSessionHasErrors(['author_id']);
    }
}
