<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;
use Illuminate\Database\Eloquent\Builder;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'type', 'created_at'];

    public function search($search)
    {
        $this->where('name', 'LIKE', "%$search%");
    }

    public function categories($categories)
    {
        $idsOrNames = explode(",", $categories);

        $this->whereHas('categories', function (Builder $query) use ($idsOrNames) {
            $query->whereIn("id", $idsOrNames)
            ->orWhereIn('name', $idsOrNames);
        });
    }

    public function withCategories() {
        $this->query->with('categories');
    }
}
