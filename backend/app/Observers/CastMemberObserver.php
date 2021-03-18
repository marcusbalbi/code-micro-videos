<?php

namespace App\Observers;

use App\Models\CastMember;
use Bschmitt\Amqp\Facades\Amqp;
use Bschmitt\Amqp\Message;

class CastMemberObserver
{
    public function created(CastMember $castMember)
    {
        $message = new Message($castMember->toJson());
        Amqp::publish("model.cast_member.created", $message);
    }

    public function updated(CastMember $castMember)
    {
        $message = new Message($castMember->toJson());
        Amqp::publish("model.cast_member.updated", $message);
    }

    public function deleted(CastMember $castMember)
    {
        $message = new Message(json_encode(["id" => $castMember->id]));
        Amqp::publish("model.cast_member.deleted", $message);
    }

    public function restored(CastMember $castMember)
    {
        //
    }

    public function forceDeleted(CastMember $castMember)
    {
        //
    }
}
