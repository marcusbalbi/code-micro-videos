<?php

declare(strict_types=1);

namespace Tests\Traits;

use Exception;

trait TestSaves
{
    protected function assertStore($sendData, $testData)
    {
        $response = $this->json('POST', $this->routeStore(), $sendData);
        $status = $response->status();
        if ($status !== 201) {
            throw new Exception("Response status must be 201, given {$status}: {$response->content()}");
        }
        $model = $this->model();
        $table = (new $model)->getTable();
        $this->assertDatabaseHas($table, $testData + ['id' => $response->json('id')]);
    }
}
