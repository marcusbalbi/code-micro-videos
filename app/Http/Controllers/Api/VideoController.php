<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
    protected function model()
    {
        return Video::class;
    }

    protected function rulesStore()
    {
        return [];
    }

    protected function rulesUpdate()
    {
        return $this->rulesStore();
    }
}
