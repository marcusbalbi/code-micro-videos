<?php

namespace App\Observers;

use Bschmitt\Amqp\Facades\Amqp;
use Bschmitt\Amqp\Message;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use ReflectionClass;

class SyncModelObserver
{
    public function created(Model $model)
    {
        $modelName = $this->getModelName($model);
        $data = $model->toArray();
        $action = __FUNCTION__;
        $routingKey = "model.{$modelName}.{$action}";
        try {
            $this->publish($routingKey, $data);
        } catch (Exception $e) {
            $this->reportException([
                "modelName" => $modelName,
                "id" => $model->id,
                "action" => $action,
                "exception" => $e
            ]);
        }
    }

    public function updated(Model $model)
    {
        $modelName = $this->getModelName($model);
        $data = $model->toArray();
        $action = __FUNCTION__;
        $routingKey = "model.{$modelName}.{$action}";
        try {
            $this->publish($routingKey, $data);
        } catch (Exception $e) {
            $this->reportException([
                "modelName" => $modelName,
                "id" => $model->id,
                "action" => $action,
                "exception" => $e
            ]);
        }
    }

    public function deleted(Model $model)
    {
        $modelName = $this->getModelName($model);
        $data = $model->toArray();
        $action = __FUNCTION__;
        $routingKey = "model.{$modelName}.{$action}";
        try {
            $this->publish($routingKey, $data);
        } catch (Exception $e) {
            $this->reportException([
                "modelName" => $modelName,
                "id" => $model->id,
                "action" => $action,
                "exception" => $e
            ]);
        }
    }

    public function belongsToManyAttached($relation, $model, $ids) {

    }


    public function restored(Model $model)
    {
        //
    }

    public function forceDeleted(Model $model)
    {
        //
    }

    protected function getModelName(Model $model) {
        $shortName = (new ReflectionClass($model))->getShortName();
        return Str::snake($shortName);
    }

    protected function publish($routingKey, array $data) {
        $message = new Message(json_encode($data), [
            'content_type' => 'application/json',
            'delivery_mode' => 2 //persistent
        ]);

        Amqp::publish($routingKey, $message, [
            'exchange_type' => 'topic',
            'exchange' =>'amq.topic'
        ]);

    }

    protected function reportException(array $params)
    {
        list(
            "modelName" => $modelName,
            "id" => $id,
            "action" => $action,
            "exception" => $exception
        ) = $params;
        $myException = new Exception("The Model {$modelName} with ID {$id} not sync on {$action}", 0, $exception);
        report($myException);
    }
}
