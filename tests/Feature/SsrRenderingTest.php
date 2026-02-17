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

class SsrRenderingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->createTestData();
    }

    #[DataProvider('publicRoutesProvider')]
    public function test_public_page_returns_200(string $route): void
    {
        $response = $this->get($route);
        $response->assertStatus(200);
    }

    #[DataProvider('publicRoutesProvider')]
    public function test_public_page_returns_html_content_type(string $route): void
    {
        $response = $this->get($route);
        $contentType = strtolower($response->headers->get('Content-Type'));
        $this->assertStringContainsString('text/html', $contentType);
    }

    #[DataProvider('publicRoutesProvider')]
    public function test_public_page_route_has_cache_middleware(string $route): void
    {
        $response = $this->get($route);
        $response->assertStatus(200);

        // Verify the route is configured with cache middleware.
        // In the testing environment, middleware may not set headers the same way,
        // so we verify the route definition rather than response headers.
        $routeObj = app('router')->getRoutes()->match(
            \Illuminate\Http\Request::create($route)
        );

        $middleware = $routeObj->gatherMiddleware();
        $hasCacheMiddleware = collect($middleware)->contains(function ($m) {
            return str_contains($m, 'CacheHeadersMiddleware');
        });

        $this->assertTrue($hasCacheMiddleware, "Route {$route} should have CacheHeadersMiddleware");
    }

    public function test_homepage_renders_inertia_component(): void
    {
        $response = $this->get('/');
        $response->assertInertia(fn ($page) =>
            $page->component('Home')
                ->has('featuredProjects')
                ->has('featuredServices')
        );
    }

    public function test_blog_index_renders_inertia_component(): void
    {
        $response = $this->get('/blog');
        $response->assertInertia(fn ($page) =>
            $page->component('Blog')
        );
    }

    public function test_blog_show_renders_inertia_component(): void
    {
        $response = $this->get('/blog/test-insight');
        $response->assertInertia(fn ($page) =>
            $page->component('Blog/Show')
                ->has('insight')
        );
    }

    public function test_services_index_renders_inertia_component(): void
    {
        $response = $this->get('/services');
        $response->assertInertia(fn ($page) =>
            $page->component('Services')
        );
    }

    public function test_services_show_renders_inertia_component(): void
    {
        $response = $this->get('/services/test-service');
        $response->assertInertia(fn ($page) =>
            $page->component('Services/Show')
                ->has('service')
        );
    }

    public function test_portfolio_index_renders_inertia_component(): void
    {
        $response = $this->get('/portfolio');
        $response->assertInertia(fn ($page) =>
            $page->component('Portfolio')
        );
    }

    public function test_portfolio_show_renders_inertia_component(): void
    {
        $response = $this->get('/portfolio/test-project');
        $response->assertInertia(fn ($page) =>
            $page->component('Portfolio/Show')
                ->has('portfolioItem')
        );
    }

    public function test_team_renders_inertia_component(): void
    {
        $response = $this->get('/team');
        $response->assertInertia(fn ($page) =>
            $page->component('Team')
        );
    }

    public function test_contact_renders_inertia_component(): void
    {
        $response = $this->get('/contact');
        $response->assertInertia(fn ($page) =>
            $page->component('Contact')
        );
    }

    public static function publicRoutesProvider(): array
    {
        return [
            'homepage'       => ['/'],
            'services'       => ['/services'],
            'portfolio'      => ['/portfolio'],
            'blog'           => ['/blog'],
            'team'           => ['/team'],
            'contact'        => ['/contact'],
        ];
    }

    private function createTestData(): void
    {
        $author = User::factory()->create([
            'name' => 'Test Author',
            'email' => 'ssr-test@example.com',
        ]);

        $category = Category::create([
            'name' => 'SSR Test Category',
            'slug' => 'ssr-test-category',
            'type' => 'insight',
        ]);

        Service::create([
            'title' => 'Test Service',
            'slug' => 'test-service',
            'description' => 'A service for SSR testing',
            'is_published' => true,
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        PortfolioItem::create([
            'title' => 'Test Project',
            'slug' => 'test-project',
            'description' => 'A project for SSR testing',
            'is_published' => true,
            'is_featured' => true,
            'sort_order' => 1,
        ]);

        Insight::create([
            'title' => 'Test Insight',
            'slug' => 'test-insight',
            'excerpt' => 'An insight for SSR testing',
            'content' => ['body' => 'Test content'],
            'author_id' => $author->id,
            'category_id' => $category->id,
            'reading_time' => 3,
            'is_published' => true,
            'published_at' => now()->subDay(),
        ]);
    }
}
