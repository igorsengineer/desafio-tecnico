<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(PaymentController::class)->group(function () {
    Route::post('/payments', 'create');
    Route::post('/payments/', 'create');
    Route::get('/payments', 'all');
    Route::get('/payments/', 'all');
    Route::get('/payments/{id}', 'byId');
    Route::get('/payments/{id}/', 'byId');
    Route::patch('/payments/{id}', 'changeStatus');
    Route::patch('/payments/{id}/', 'changeStatus');
    Route::delete('/payments/{id}', 'delete');
    Route::delete('/payments/{id}/', 'delete');
});
