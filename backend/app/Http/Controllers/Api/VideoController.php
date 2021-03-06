<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BasicCrudController;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Rules\GenresHasCategoriesRule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{
    private $rules;

    public function __construct()
    {
        $this->rules = [
            'title' => 'required|max:255',
            'description' => 'required',
            'year_launched' => 'required|date_format:Y|min: 1',
            'opened' => 'boolean',
            'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
            'duration' => 'required|integer|min: 1',
            'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL',
            'genres_id' => [
                'required',
                'array',
                'exists:genres,id,deleted_at,NULL'
            ],
            'cast_members_id' => [
                'required',
                'array',
                'exists:cast_members,id,deleted_at,NULL'
            ],
            'thumb_file' => 'image|max:' . Video::THUMB_FILE_MAX_FILE,
            'banner_file' => 'image|max:' . Video::BANNER_FILE_MAX_FILE,
            'trailer_file' => 'mimetypes:video/mp4|max:' . VIDEO::TRAILER_FILE_MAX_FILE,
            'video_file' => 'mimetypes:video/mp4|max:' . VIDEO::VIDEO_FILE_MAX_FILE
        ];
    }

    protected function addRuleIfGenreHasCategories(Request $request)
    {
        $categoriesId = $request->get('categories_id');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genres_id'][] = new GenresHasCategoriesRule($categoriesId);
    }

    public function store(Request $request)
    {
        $this->addRuleIfGenreHasCategories($request);
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $this->addRuleIfGenreHasCategories($request);
        $validatedData = $this->validate(
            $request,
            $request->isMethod("PUT") ? $this->rulesUpdate() : $this->rulesPatch()
        );
        $obj->update($validatedData);
        $resource = $this->resource();
        return new $resource($obj);
    }

    protected function model()
    {
        return Video::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }

    protected function resource()
    {
        return VideoResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }

    protected function queryBuilder(): Builder
    {
        return parent::queryBuilder()->with(['genres.categories']);
    }
}
