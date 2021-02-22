<?php

namespace App\ModelFilters;

// use EloquentFilter\ModelFilter;
// use Illuminate\Database\Eloquent\Builder;

class VideoFilter extends DefaultModelFilter
{
    protected $sortable = ['title', 'created_at'];

    public function search($search)
    {
        $this->where('title', 'LIKE', "%$search%");
    }
}
