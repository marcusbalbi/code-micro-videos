<?php

namespace Tests\Traits;

use Exception;

trait TestProd
{
    protected function skilTestIfNotProd($message = '')
    {
        if (!$this->isTestingProd()) {
            $this->markTestSkipped($message);
        }
    }

    protected function isTestingProd()
    {
        return env('TESTING_PROD', false) !== false;
    }
}
