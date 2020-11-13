<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    private $data;

    protected function setUp(): void
    {
        parent::setUp();

        $this->data = [
            'title' => 'some Title',
            'description' => 'short description',
            'year_launched' => 1983,
            'rating' => Video::RATING_LIST[0],
            'duration' => 30
        ];
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        factory(Video::class, 1)->create();

        $videos = Video::all();
        $this->assertCount(1, $videos);

        $keys = array_keys($videos->first()->getAttributes());
        $this->assertEqualsCanonicalizing(
            [
                'id',
                'title',
                'description',
                'year_launched',
                'opened',
                'rating',
                'duration',
                'deleted_at',
                'updated_at'
            ],
            $keys
        );
    }

    public function testCreateWithBasicFields()
    {
        $video = Video::create($this->data);
        $video->refresh();

        $this->assertUuidV4($video->id);
        $this->assertFalse($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => false]);

        $video = Video::create($this->data + ['opened' => true]);

        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => true]);
    }

    public function testCreateWithRelations()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();

        $video = Video::create($this->data + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id]
        ]);

        $this->assertHasCategory($video->id, $category->id);
        $this->assertHasGenre($video->id, $genre->id);
    }

    public function testUpdateWithBasicFields()
    {
        $video = factory(Video::class)
            ->create(['opened' => false]);

        $video->update($this->data);
        $this->assertFalse($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => false]);

        $video = factory(Video::class)
            ->create(['opened' => false]);

        $video->update($this->data + ['opened' => true]);
        $this->assertTrue($video->opened);
        $this->assertDatabaseHas('videos', $this->data + ['opened' => true]);
    }

    public function testUpdateWithRelations()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create();
        $video = factory(Video::class)->create();

        $video->update($this->data + [
            'categories_id' => [$category->id],
            'genres_id' => [$genre->id]
        ]);

        $this->assertHasCategory($video->id, $category->id);
        $this->assertHasGenre($video->id, $genre->id);
    }

    public function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_video', [
            'video_id' => $videoId,
            'category_id' => $categoryId
        ]);
    }

    public function assertHasGenre($videoId, $categoryId)
    {
        $this->assertDatabaseHas('genre_video', [
            'video_id' => $videoId,
            'genre_id' => $categoryId
        ]);
    }

    public function testRemove()
    {
        $videos = factory(Video::class, 2)->create();

        $videos[0]->delete();

        $total = Video::count();

        $this->assertEquals(1, $total);
        $this->assertNull(Video::find($videos[0]->id));

        $videos[0]->restore();
        $this->assertNotEmpty(Video::find($videos[0]->id));
    }

    public function testRollbackCreate()
    {
        $hasErrors = false;
        try {
            $r = Video::create([
                'title' => 'some Title',
                'description' => 'short description',
                'year_launched' => 1983,
                'rating' => Video::RATING_LIST[0],
                'duration' => 30,
                'categories_id' => [0, 1, 2, 3]
            ]);
        } catch (QueryException $e) {
            $this->assertCount(0, Video::all());
            $hasErrors = true;
        }
        $this->assertTrue($hasErrors);
    }

    public function testRollbackUpdate()
    {
        $video =  factory(Video::class)->create();
        $title = $video->title();
        $hasErrors = false;
        try {
            $video->update([
                'title' => 'some Title',
                'description' => 'short description',
                'year_launched' => 1983,
                'rating' => Video::RATING_LIST[0],
                'duration' => 30,
                'categories_id' => [0, 1, 2, 3]
            ]);
        } catch (QueryException $e) {
            $videoAfter = Video::find($video->id);
            $this->assertEquals($title, $videoAfter->title);
            $hasErrors = true;
        }
        $this->assertTrue($hasErrors);
    }
}
