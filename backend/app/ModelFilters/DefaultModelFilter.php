<?php

namespace App\ModelFilters;

use EloquentFilter\ModelFilter;
use Illuminate\Support\Str;

abstract class DefaultModelFilter extends ModelFilter
{
    protected $sortable = [];

    public function setup()
    {
        $this->blacklistMethod('isSortable');
        $noSort = $this->input('sort', '');

        if (!$noSort) {
            $this->orderBy('created_at', 'DESC');
        }
    }

    public function sort($column)
    {
        if (method_exists($this, $method = 'sortBy' . Str::studly($column))) {
            $this->$method($column);
        }
            if ($this->isSortable($column)) {
                $dir = strtolower($this->input('dir')) === 'asc' ? 'ASC' : "DESC";
                $this->orderBy($column, $dir);
            }
    }

    protected function isSortable($colum)
    {
        return in_array($colum, $this->sortable);
    }
}
