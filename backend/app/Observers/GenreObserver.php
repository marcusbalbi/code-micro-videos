<?php

namespace App\Observers;

use App\Models\Genre;
use Bschmitt\Amqp\Facades\Amqp;
use Bschmitt\Amqp\Message;

class GenreObserver
{
    public function created(Genre $genre)
    {
        $message = new Message($genre->toJson());
        Amqp::publish("model.genre.created", $message);
    }

    public function updated(Genre $genre)
    {
        $message = new Message($genre->toJson());
        Amqp::publish("model.genre.updated", $message);
    }

    public function deleted(Genre $genre)
    {
        $message = new Message(json_encode(["id" => $genre->id]));
        Amqp::publish("model.genre.deleted", $message);
    }

    public function restored(Genre $genre)
    {
        //
    }

    public function forceDeleted(Genre $genre)
    {
        //
    }
}
