<?php

namespace App\Observers;

use App\Models\Category;
use Bschmitt\Amqp\Facades\Amqp;
use Bschmitt\Amqp\Message;

class CategoryObserver
{
    public function created(Category $category)
    {
        $message = new Message($category->toJson());
        Amqp::publish("model.category.created", $message);
    }

    public function updated(Category $category)
    {
        $message = new Message($category->toJson());
        Amqp::publish("model.category.updated", $message);
    }

    public function deleted(Category $category)
    {
        $message = new Message(json_encode(["id" => $category->id ]));
        Amqp::publish("model.category.deleted", $message);
    }

    public function restored(Category $category)
    {
        //
    }

    public function forceDeleted(Category $category)
    {
        //
    }
}
