<?php

namespace App\Http\Controllers\Api;

use App\Models\Genre;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\BasicCrudController;
use App\Http\Resources\GenreResource;
use Illuminate\Database\Eloquent\Builder;

class GenreController extends BasicCrudController
{
    protected function model()
    {
        return Genre::class;
    }
    protected function rulesStore()
    {
        return [
            'name' => 'required|max:255',
            'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL',
            'is_active' => 'boolean'
        ];
    }

    protected function rulesUpdate()
    {
        return $this->rulesStore();
    }

    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $self = $this;
        $obj = \DB::transaction(function () use ($request, $validatedData, $self) {
            $obj = $this->model()::create($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $self = $this;
        $obj = \DB::transaction(function () use ($request, $validatedData, $self, $obj) {
            $obj->update($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $resource = $this->resource();
        return new $resource($obj);
    }

    protected function handleRelations($video, Request $request)
    {
        $video->categories()->sync($request->get('categories_id'));
    }

    protected function resource()
    {
        return GenreResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }
}
