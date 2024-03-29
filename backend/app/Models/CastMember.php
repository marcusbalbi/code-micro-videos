<?php

namespace App\Models;

use App\ModelFilters\CastMemberFilter;
use App\Models\Traits\SerializeDateToIso8601;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use EloquentFilter\Filterable;

class CastMember extends Model
{
    use SoftDeletes, Traits\Uuid, Filterable, SerializeDateToIso8601;

    const TYPE_DIRECTOR = 1;
    const TYPE_ACTOR = 2;

    public static $types = [
        CastMember::TYPE_ACTOR,
        CastMember::TYPE_DIRECTOR,
    ];

    protected $fillable = [
        'name',
        'type',
    ];

    protected $keyType = 'string';

    protected $casts = [
        'id' => 'string'
    ];

    protected $dates = ['deleted_at'];

    public $incrementing = false;

    public function modelFilter()
    {
        return $this->provideFilter(CastMemberFilter::class);
    }
}
