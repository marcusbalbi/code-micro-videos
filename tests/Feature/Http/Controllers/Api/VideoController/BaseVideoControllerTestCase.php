<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use Tests\TestCase;
use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\Traits\TestValidations;

abstract class BaseVideoControllerTestCase extends TestCase
{
    use TestValidations, DatabaseMigrations;

    protected $video;
    protected $sendData;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sendData = [
            'title' => 'some Title',
            'description' => 'short description',
            'year_launched' => 1983,
            'rating' => Video::RATING_LIST[0],
            'duration' => 30
        ];
        $this->video = factory(Video::class)->create();
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
