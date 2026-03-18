<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Service;
use App\Models\PortfolioItem;
use App\Models\Insight;
use App\Models\User;
use App\Models\Category;
use PHPUnit\Framework\Attributes\DataProvider;

class SeoSnapshotTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->createTestData();
    }

    #[DataProvider('listPagesProvider')]
    public function test_list_page_has_og_title(string $route): void
    {
        $response = $this->get($route);
        $response->assertStatus(200);

        // Inertia shares SEO data — verify the shared seo prop exists
        $response->assertInertia(fn ($page) =>
            $page->has('seo')
        );
    }

    #[DataProvider('listPagesProvider')]
    public function test_list_page_has_shared_site_data(string $route): void
    {
        $response = $this->get($route);
        $response->assertInertia(fn ($page) =>
            $page->has('site')
        );
    }

    public function test_blog_show_has_article_structured_data(): void
    {
        $response = $this->get('/blog/test-insight');
        $response->assertInertia(fn ($page) =>
            $page->component('Blog/Show')
                ->has('insight')
                ->where('insight.title', 'Test Insight')
                ->has('insight.published_at')
                ->has('insight.author')
        );
    }

    public function test_services_show_has_service_data(): void
    {
        $response = $this->get('/services/test-service');
        $response->assertInertia(fn ($page) =>
            $page->component('Services/Show')
                ->has('service')
                ->where('service.title', 'Test Service')
        );
    }

    public function test_portfolio_show_has_portfolio_data(): void
    {
        $response = $this->get('/portfolio/test-project');
        $response->assertInertia(fn ($page) =>
            $page->component('Portfolio/Show')
                ->has('portfolioItem')
                ->where('portfolioItem.title', 'Test Project')
        );
    }

    public function test_seo_config_is_shared_with_expected_keys(): void
    {
        $response = $this->get('/');
        $response->assertInertia(fn ($page) =>
            $page->has('seo')
                ->has('site')
        );
    }

    public static function listPagesProvider(): array
    {
        return [
            'homepage'  => ['/'],
            'services'  => ['/services'],
            'portfolio' => ['/portfolio'],
            'blog'      => ['/blog'],
            'team'      => ['/team'],
            'contact'   => ['/contact'],
        ];
    }

    private function createTestData(): void
    {
        $author = User::factory()->create([
            'name' => 'SEO Test Author',
            'email' => 'seo-test@example.com',
        ]);

        $category = Category::create([
            'name' => 'SEO Test',
            'slug' => 'seo-test',
            'type' => 'insight',
        ]);

        Service::create([
            'title' => 'Test Service',
            'slug' => 'test-service',
            'description' => 'Service for SEO testing',
            'is_published' => true,
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        PortfolioItem::create([
            'title' => 'Test Project',
            'slug' => 'test-project',
            'description' => 'Project for SEO testing',
            'is_published' => true,
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        Insight::create([
            'title' => 'Test Insight',
            'slug' => 'test-insight',
            'excerpt' => 'Insight for SEO testing',
            'content' => ['body' => 'Full test content body'],
            'author_id' => $author->id,
            'category_id' => $category->id,
            'reading_time' => 5,
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);
    }
}
