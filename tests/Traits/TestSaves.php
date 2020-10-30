<?php

declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;

use Exception;

trait TestSaves
{
    protected function assertStore(array $sendData, array $testDatabase, array  $testJsonData = null): TestResponse
    {
        $response = $this->json('POST', $this->routeStore(), $sendData);
        $status = $response->status();
        if ($status !== 201) {
            throw new Exception("Response status must be 201, given {$status}: {$response->content()}");
        }
        $model = $this->model();
        $table = (new $model)->getTable();
        $this->assertDatabaseHas($table, $testDatabase + ['id' => $response->json('id')]);
        $testResponse = $testJsonData ?? $testDatabase;
        $response->assertJsonFragment($testResponse + ['id' => $response->json('id')]);

        return $response;
    }
}
