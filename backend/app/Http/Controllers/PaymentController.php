<?php

namespace App\Http\Controllers;

use Illuminate\Http\{JsonResponse, Response, Request};
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\Payment;

class PaymentController extends Controller
{
    public function create(Request $request): JsonResponse|Response
    {
        if (strlen($request->getContent()) == 0) {
            return response()->json([
                "status" => "Payment not provided in the request body"
            ])->setStatusCode(400);
        }

        $body = ($request->all());
        try {
            Validator::make($body, [
                'transaction_amount' => 'required|decimal:1,2',
                'installments' => 'required|integer',
                'token' => 'required|string',
                'payment_method_id' => 'required|string',
                'payer.email' => 'required|string|email',
                'payer.identification.type' => 'required|string',
                'payer.identification.number' => 'required|integer'
            ])->validate();
        } catch (ValidationException) {
            return response()->json([
                "status" => "Invalid payment provided.The possible reasons are:\n" .
                    "○ A field of the provided payment was null or with invalid values",
            ])->setStatusCode(422);
        }

        $payment = new Payment();
        $payment->id = $payment->newUniqueId();
        $payment->transaction_amount = $body['transaction_amount'];
        $payment->installments = $body['installments'];
        $payment->token = $body['token'];
        $payment->payment_method_id = $body['payment_method_id'];
        $payment->payer_email = $body['payer']['email'];
        $payment->payer_identification_type = $body['payer']['identification']['type'];
        $payment->payer_identification_number = $body['payer']['identification']['number'];

        if(!$payment->save()) {
            return (new Response())->setStatusCode(500);
        }

        return response()
            ->json([
                'id' => $payment->id,
                'created_at' => $payment->created_at->format("Y-m-d")
            ])
            ->setStatusCode(200);
    }

    public function all(): JsonResponse
    {
        $payments = Payment::all();
        $paymentResponse = [];

        foreach ($payments as $payment) {
            $paymentResponse[] = $this->formatResponse($payment);
        }

        return response()
            ->json($paymentResponse)
            ->setStatusCode(200);
    }

    public function byId($id): JsonResponse|Response
    {
        try {
            $payment = Payment::findOrFail($id);

            return response()
                ->json($this->formatResponse($payment))
                ->setStatusCode(200);
        } catch (ModelNotFoundException) {
            return (new Response())->setStatusCode(404);
        } catch (\Exception) {
            return (new Response())->setStatusCode(500);
        }
    }

    public function changeStatus(Request $request, $id): JsonResponse|Response
    {
        $status = $request->all()['status'];
        if (!$this->statusValid($status)) {
            return response()
                ->json(["status" => "Invalid status provided."])
                ->setStatusCode(400);
        }

        try {
            $payment = Payment::findOrFail($id);
            $payment->status = $status;
            $payment->save();
        } catch (ModelNotFoundException) {
            return response()
                ->json(["status" => "Bankslip not found with the specified id"])
                ->setStatusCode(404);
        } catch (\Exception) {
            return (new Response())->setStatusCode(500);
        }

        return (new Response())->setStatusCode(204);
    }

    public function delete(Request $request, $id): JsonResponse|Response
    {
        try {
            $payment = Payment::findOrFail($id);
            $payment->status = "CANCELED";
            $payment->save();
        } catch (ModelNotFoundException) {
            return response()
                ->json(["status" => "Payment not found with the specified id"])
                ->setStatusCode(404);
        } catch (\Exception) {
            return (new Response())->setStatusCode(500);
        }

        return (new Response())->setStatusCode(204);
    }

    public static function formatResponse(Payment $payment): array {
        return [
            'id' => $payment->id,
            'status' => $payment->status,
            'transaction_amount' => $payment->transaction_amount,
            'installments' => $payment->installments,
            'token' => $payment->token,
            'payment_method_id' => $payment->payment_method_id,
            'payer' => [
                'entity_type' => $payment->payer_entity_type,
                'type' => $payment->payer_type,
                'email' => $payment->payer_email,
                'identification' => $payment->payer_identification_type,
                'number' => $payment->payer_identification_number
            ],
            'notification_url' => $payment->notification_url,
            'created_at' => $payment->created_at->format("Y-m-d"),
            'updated-at' => $payment->updated_at->format("Y-m-d")
        ];
    }

    public static function statusValid(string $status): bool
    {
        return ($status == "PAID" ||
            $status == "PENDING" ||
            $status == "CANCELED");
    }
}
