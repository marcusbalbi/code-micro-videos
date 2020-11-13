<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;
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

    public function testCreate()
    {
    }

    public function testUpdate()
    {
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
