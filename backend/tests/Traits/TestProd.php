<?php

namespace Tests\Traits;

use Exception;

trait TestProd
{
    protected function skilTestIfNotProd($message = '')
    {
        // dd($this->isTestingProd());
        if (!$this->isTestingProd()) {
            $this->markTestSkipped($message);
        }
    }

    protected function isTestingProd()
    {
        return env('TESTING_PROD') !== false;
    }
}
