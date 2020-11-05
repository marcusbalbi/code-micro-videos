<?php

namespace App\Http\Controllers\Api;

use App\Models\CastMember;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BasicCrudController;

class CastMemberController extends BasicCrudController
{
    protected function model()
    {
        return CastMember::class;
    }
    protected function rulesStore()
    {
        return [
            'name' => 'required|max:255',
            'type' => 'required|numeric|in:1,2'
        ];
    }

    protected function rulesUpdate()
    {
        return $this->rulesStore();
    }
}
