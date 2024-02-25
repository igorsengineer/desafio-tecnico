<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Http\Controllers\PaymentController;
use App\Models\Payment as PaymentModel;

class PaymentTest extends TestCase
{
    public function test_create_payment_with_no_body(): void
    {
        $response = $this->post("/rest/payments");
        $response->assertStatus(400);
    }

    public function test_create_payment_with_bad_request(): void
    {
        $response = $this->postJson("/rest/payments", [
            "transaction_amount" => 245.95,
            "token" => "ae4e50b2a8f3h6d9f2c3a4b5d6e7f8g9",
            "payment_method_id" => "master",
            "payer" => [
                "email" => "example_random@gmail.com",
                "identification" => [
                    "type" => "CPF",
                    "number" => "12345678909"
                ]
            ]
        ]);

        $response->assertStatus(422);
    }

    public function test_create_payment_success(): void
    {
        $response = $this->postJson("/rest/payments", [
            "transaction_amount" => 245.95,
            "installments" => 3,
            "token" => "ae4e50b2a8f3h6d9f2c3a4b5d6e7f8g9",
            "payment_method_id" => "master",
            "payer" => [
                "email" => "example_random@gmail.com",
                "identification" => [
                    "type" => "CPF",
                    "number" => "12345678909"
                ]
            ]
        ]);

        $response->assertStatus(200);

        $jsonResponse = $response->json();
        $this->assertEquals(36, strlen($jsonResponse["id"]));
    }

    public function test_get_all_payments(): void
    {
        $firstPayment = PaymentModel::factory()->create([
            'token' => 'D390d2y3ocb9d2',
            'payer_email' => "fakemail@gmail.com",
            'payer_identification_number' => 12345678901
        ]);
        $secondPayment = PaymentModel::factory()->create([
            'token' => 'jbdj87d3BDUI37',
            'payer_email' => "fakemail2@gmail.com",
            'payer_identification_number' => 11987654321
        ]);

        $response = $this->get("/rest/payments/");
        $response->assertStatus(200);

        $jsonResponse = $response->json();
        $this->assertEquals([
            PaymentController::formatResponse($firstPayment),
            PaymentController::formatResponse($secondPayment)
        ], $jsonResponse);
    }

    public function test_get_payment_by_id_not_found(): void
    {
        $response = $this->get("/rest/payments/9b5ff62d-5313-4d07-8040-37d56e2316ba");
        $response->assertStatus(404);
    }

    public function test_get_payment_by_id(): void
    {
        $payment = PaymentModel::factory()->create([
            'token' => 'D390d2y3ocb9d2',
            'payer_email' => "fakemail@gmail.com",
            'payer_identification_number' => 12345678901
        ]);

        $response = $this->get("/rest/payments/" . $payment->id);
        $response->assertStatus(200);

        $jsonResponse = $response->json();
        $this->assertEquals(PaymentController::formatResponse($payment), $jsonResponse);
    }

    public function test_change_payment_status_invalid_status(): void
    {
        $response = $this->patchJson("/rest/payments/9b5ff62d-5313-4d07-8040-37d56e2316ba/", [
            "status" => "INVALID"
        ]);

        $response->assertStatus(400);
    }

    public function test_change_payment_status_not_found(): void
    {
        $response = $this->patchJson("/rest/payments/9b5ff62d-5313-4d07-8040-37d56e2316ba/", [
            "status" => "PAID"
        ]);

        $response->assertStatus(404);
    }

    public function test_change_payment_status(): void
    {
        $payment = PaymentModel::factory()->create();

        $response = $this->patchJson("/rest/payments/". $payment->id ."/", [
            "status" => "PAID"
        ]);

        $response->assertStatus(204);

        $alteredPayment = PaymentModel::find($payment->id);
        $this->assertTrue($alteredPayment->status != $payment->status);
        $this->assertEquals("PAID", $alteredPayment->status);
    }

    public function test_delete_payment_status_not_found(): void
    {
        $response = $this->delete("/rest/payments/9b5ff62d-5313-4d07-8040-37d56e2316ba");
        $response->assertStatus(404);
    }

    public function test_delete_payment_status(): void
    {
        $payment = PaymentModel::factory()->create();

        $response = $this->delete("/rest/payments/". $payment->id);
        $response->assertStatus(204);

        $alteredPayment = PaymentModel::find($payment->id);
        $this->assertTrue($alteredPayment->status != $payment->status);
        $this->assertEquals("CANCELED", $alteredPayment->status);
    }
}
