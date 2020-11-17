<?php

namespace Tests\Feature\Models\Video;


use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BaseVideoTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $data;

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

}
