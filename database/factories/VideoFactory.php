<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Video;
use Faker\Generator as Faker;
use Illuminate\Http\UploadedFile;

$factory->define(Video::class, function (Faker $faker) {
    $rating = array_rand(Video::RATING_LIST);
    return [
        'title' => $faker->sentence(3),
        'description' => $faker->sentence(10),
        'year_launched' => rand(1895, 2022),
        'opened' => rand(0, 1),
        'rating' => Video::RATING_LIST[$rating],
        'duration' => rand(1, 30),
        /*'published' => rand(0, 1)*/
    ];
});
