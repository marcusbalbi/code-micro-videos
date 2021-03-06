<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use ReflectionClass;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Builder;

abstract class BasicCrudController extends Controller
{
    protected $defaultPerPage = 15;

    protected abstract function model();
    protected abstract function rulesStore();
    protected abstract function rulesUpdate();
    protected abstract function resource();
    protected abstract function resourceCollection();

    public function index(Request $request)
    {

        $perPage = (int)$request->get('per_page', $this->defaultPerPage);
        $hasFilter = in_array(
            Filterable::class,
            class_uses($this->model())
        );

        $query = $this->queryBuilder();

        if ($hasFilter) {
            $query = $query->filter($request->all());
        }

        $data = $request->has('all') || !$this->defaultPerPage ? $query->get() : $query->paginate($perPage);

        $resourceCollectionClass = $this->resourceCollection();
        $refClass = new ReflectionClass($resourceCollectionClass);

        return $refClass->isSubclassOf(ResourceCollection::class) ?
            new $resourceCollectionClass($data) :
            $resourceCollectionClass::collection($data);
    }

    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();

        return $this->queryBuilder()->where($keyName, $id)->firstOrFail();
    }


    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->queryBuilder()->create($validatedData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }


    public function show($id, Request $request)
    {
        $obj = $this->findOrFail($id);
        $relations = explode(",", $request->get("with", ""));

        if ($request->get("with")) {
            $obj->load($relations);
        }
        $resource = $this->resource();
        return new $resource($obj);
    }


    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate(
            $request,
            $request->isMethod("PUT") ? $this->rulesUpdate() : $this->rulesPatch()
        );
        $obj->update($validatedData);
        $resource = $this->resource();
        return new $resource($obj);
    }

    protected function rulesPatch()
    {
        return array_map(function ($rules) {
            if (is_array($rules)) {
                $exists = in_array("required", $rules);
                if ($exists) {
                    array_unshift($rules, "sometimes");
                }
            } else {
                return str_replace("required", "sometimes|required", $rules);
            }
            return $rules;
        }, $this->rulesUpdate());
    }

    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent();
    }

    public function destroyCollection(Request $request)
    {
        $data = $this->validateIds($request);
        $this->model()::whereIn('id', $data["ids"])->delete();
        return response()->noContent();
    }
    public function validateIds(Request $request)
    {
        $model = $this->model();
        $ids = explode(",", $request->get("ids"));
        $validator = \Validator::make([
            "ids" => $ids
        ], [
            "ids" => "required|exists:" . (new $model)->getTable() . ",id"
        ]);

        return $validator->validate();
    }

    protected function queryBuilder(): Builder
    {
        return $this->model()::query();
    }
}
