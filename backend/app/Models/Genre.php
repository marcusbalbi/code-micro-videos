<?php

namespace App\Models;

use App\ModelFilters\GenreFilter;
use App\Models\Traits\SerializeDateToIso8601;
use Chelout\RelationshipEvents\Concerns\HasBelongsToManyEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use EloquentFilter\Filterable;

class Genre extends Model
{
    use SoftDeletes, Traits\Uuid, Filterable, SerializeDateToIso8601, HasBelongsToManyEvents;

    protected $fillable = [
        'name',
        'is_active'
    ];

    protected $keyType = 'string';

    protected $casts = [
        'id' => 'string',
        'is_active' => 'boolean'
    ];

    protected $dates = ['deleted_at'];

    public $incrementing = false;

    protected $observables = [
        'belongsToManyAttached'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function modelFilter()
    {
        return $this->provideFilter(GenreFilter::class);
    }
}
