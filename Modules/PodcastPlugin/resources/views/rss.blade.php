{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<rss version="2.0" 
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/" 
    xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" 
    xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <atom:link href="{{ request()->url() }}" rel="self" type="application/rss+xml" />
        <title>{{ $category->name }}</title>
        <link>{{ config('app.url') }}</link>
        <language>{{ $category->language ?? 'en' }}</language>
        <copyright>℗ &amp; © {{ now()->year }} {{ $category->author ?? config('app.name') }}</copyright>
        <itunes:author>{{ $category->author ?? config('app.name') }}</itunes:author>
        <description>{{ $category->description }}</description>
        <itunes:summary>{{ strip_tags($category->description) }}</itunes:summary>
        <itunes:owner>
            <itunes:name>{{ $category->owner_name ?? config('app.name') }}</itunes:name>
            <itunes:email>{{ $category->owner_email ?? config('mail.from.address') }}</itunes:email>
        </itunes:owner>
        <itunes:explicit>{{ $category->itunes_explicit ? 'yes' : 'no' }}</itunes:explicit>
        <itunes:type>{{ $category->itunes_type ?? 'episodic' }}</itunes:type>
        
        @if($category->artwork)
            <itunes:image href="{{ str_starts_with($category->artwork, 'http') ? $category->artwork : config('app.url') . Storage::url($category->artwork) }}" />
            <image>
                <url>{{ str_starts_with($category->artwork, 'http') ? $category->artwork : config('app.url') . Storage::url($category->artwork) }}</url>
                <title>{{ $category->name }}</title>
                <link>{{ config('app.url') }}</link>
            </image>
        @endif

        @if($category->itunes_category)
            @php
                $categories = explode('>', $category->itunes_category);
                $mainCat = trim($categories[0]);
                $subCat = isset($categories[1]) ? trim($categories[1]) : null;
            @endphp
            <itunes:category text="{{ $mainCat }}">
                @if($subCat)
                    <itunes:category text="{{ $subCat }}" />
                @endif
            </itunes:category>
        @else
            <itunes:category text="Society &amp; Culture" />
        @endif

        @foreach($podcasts as $podcast)
            <item>
                <title>{{ $podcast->title }}</title>
                <itunes:author>{{ $category->author ?? config('app.name') }}</itunes:author>
                <description>{{ $podcast->description }}</description>
                <itunes:summary>{{ strip_tags($podcast->description) }}</itunes:summary>
                <content:encoded><![CDATA[{!! $podcast->content !!}]]></content:encoded>
                
                @php
                    $mediaUrl = $podcast->media_full_url;
                    if (!str_starts_with($mediaUrl, 'http')) {
                        $mediaUrl = config('app.url') . $mediaUrl;
                    }
                    
                    $mimeType = 'audio/mpeg';
                    if ($podcast->media_type === 'video') {
                        $mimeType = 'video/mp4';
                    }
                    
                    // Try to get file size
                    $fileSize = 0;
                    try {
                        if (!str_starts_with($podcast->media_url, 'http') && Storage::exists($podcast->media_url)) {
                             $fileSize = Storage::size($podcast->media_url);
                        }
                    } catch (\Exception $e) {}
                @endphp

                <enclosure url="{{ $mediaUrl }}" length="{{ $fileSize }}" type="{{ $mimeType }}" />
                <guid isPermaLink="false">{{ $podcast->id }}@tge-podcast</guid>
                <pubDate>{{ $podcast->published_at ? $podcast->published_at->toRfc2822String() : now()->toRfc2822String() }}</pubDate>
                <itunes:duration>{{ $podcast->duration }}</itunes:duration>
                <itunes:explicit>{{ $category->itunes_explicit ? 'yes' : 'no' }}</itunes:explicit>
                
                @if($podcast->episode_number)
                    <itunes:episode>{{ $podcast->episode_number }}</itunes:episode>
                @endif
                @if($podcast->season_number)
                    <itunes:season>{{ $podcast->season_number }}</itunes:season>
                @endif
                
                @if($podcast->thumbnail)
                    <itunes:image href="{{ str_starts_with($podcast->thumbnail, 'http') ? $podcast->thumbnail : config('app.url') . Storage::url($podcast->thumbnail) }}" />
                @endif
            </item>
        @endforeach
    </channel>
</rss>
