<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\PaymentController;
use App\Models\Payment as PaymentModel;

class PaymentTest extends TestCase
{
    public function test_formatResponse(): void
    {
        $payment = PaymentModel::factory()->make();
        $response = PaymentController::formatResponse($payment);
        $this->assertSame($payment->payer_identification_type, $response['payer']['identification']);
        $this->assertSame($payment->created_at->format("Y-m-d"), $response['created_at']);
    }

    public function test_statusValid(): void
    {
        $testStatuses = [
            "PAID" => true,
            "CANCELED" => true,
            "PENDING" => true,
            "OTHER" => false,
            "FAKE" => false
        ];

        foreach ($testStatuses as $key => $value) {
            $this->assertEquals($value, PaymentController::statusValid($key));
        }
    }
}
