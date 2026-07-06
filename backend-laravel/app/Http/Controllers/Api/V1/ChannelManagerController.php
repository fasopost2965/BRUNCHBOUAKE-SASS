<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ChannelManagerController extends Controller
{
    /**
     * Ingest external reservations from OTAs (Booking.com, Airbnb, etc.) via Channel Manager.
     * Route: POST /api/v1/integrations/booking
     */
    public function ingestBooking(Request $request)
    {
        // 1. Strict Multi-Tenant Isolation validation via Headers
        $tenantId = $request->header('X-Tenant-ID');
        $integrationToken = $request->header('X-Integration-Token') ?: $request->bearerToken();

        if (empty($tenantId)) {
            return response()->json([
                'error' => 'Missing Multi-Tenant Isolation Header (X-Tenant-ID)',
                'code' => 'MISSING_TENANT_ID'
            ], 400);
        }

        if (empty($integrationToken)) {
            return response()->json([
                'error' => 'Unauthorized. Missing X-Integration-Token or Bearer Token.',
                'code' => 'UNAUTHORIZED_INTEGRATION'
            ], 401);
        }

        // Validate the integration token against configured values
        $expectedToken = config('services.channel_manager.token') ?: env('CHANNEL_MANAGER_TOKEN', 'brunch_bouake_secure_webhook_token_2026');
        if ($integrationToken !== $expectedToken) {
            return response()->json([
                'error' => 'Invalid security token for external channel manager.',
                'code' => 'INVALID_TOKEN'
            ], 403);
        }

        // 2. Validate payload input format
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|string', // Unique external ID from OTA (e.g. Booking.com)
            'room_type' => 'required|in:studio,room,apartment',
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:50',
            'guest_email' => 'nullable|email|max:255',
            'check_in_date' => 'required|date_format:Y-m-d',
            'check_out_date' => 'required|date_format:Y-m-d|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
            'special_requests' => 'nullable|string',
            'source' => 'required|string|in:Booking.com,Airbnb,Expedia,Direct',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation error',
                'details' => $validator->errors(),
                'code' => 'VALIDATION_FAILED'
            ], 422);
        }

        $data = $request->all();
        $externalId = $data['booking_id'];

        // 3. IDEMPOTENCY / DOUBLE INGESTION PROTECTION
        // Check if this external booking ID has already been recorded for this specific tenant
        $existingReservation = Reservation::where('tenant_id', $tenantId)
            ->where('external_reservation_id', $externalId)
            ->first();

        if ($existingReservation) {
            return response()->json([
                'success' => true,
                'message' => 'Reservation already ingested (Idempotency trigger)',
                'data' => $existingReservation,
                'idempotency_status' => 'DUPLICATE_BYPASS'
            ], 200); // 200 OK because the operation is idempotent
        }

        // 4. Find an available room of the requested type for those dates
        // In a real channel manager, we search for rooms of that type which do not overlap
        $room = Room::where('tenant_id', $tenantId)
            ->where('type', $data['room_type'])
            ->whereDoesntHave('reservations', function ($query) use ($data) {
                $query->where('status', '!=', 'cancelled')
                      ->where(function ($q) use ($data) {
                          $q->whereBetween('check_in_date', [$data['check_in_date'], $data['check_out_date']])
                            ->orWhereBetween('check_out_date', [$data['check_in_date'], $data['check_out_date']])
                            ->orWhere(function ($sub) use ($data) {
                                $sub->where('check_in_date', '<=', $data['check_in_date'])
                                    ->where('check_out_date', '>=', $data['check_out_date']);
                            });
                      });
            })
            ->first();

        if (!$room) {
            return response()->json([
                'error' => 'Aucune chambre de type ' . $data['room_type'] . ' n\'est libre pour les dates sélectionnées.',
                'code' => 'OVERBOOKING_PREVENTION'
            ], 422);
        }

        // 5. Atomic database insertion to ensure safety
        try {
            $reservation = DB::transaction(function () use ($tenantId, $room, $data, $externalId) {
                return Reservation::create([
                    'id' => (string) Str::uuid(),
                    'tenant_id' => $tenantId,
                    'room_id' => $room->id,
                    'guest_name' => $data['guest_name'],
                    'guest_phone' => $data['guest_phone'],
                    'guest_email' => $data['guest_email'] ?? null,
                    'check_in_date' => $data['check_in_date'],
                    'check_out_date' => $data['check_out_date'],
                    'number_of_guests' => $data['number_of_guests'],
                    'status' => 'confirmed',
                    'total_amount' => (int) $data['total_amount'],
                    'paid_amount' => 0, // Paid amounts are processed through separate payment flows
                    'payment_status' => 'unpaid',
                    'special_requests' => $data['special_requests'] ?? null,
                    'security_pin' => str_pad((string) rand(0, 9999), 4, '0', STR_PAD_LEFT), // Secure 4-digit PIN
                    'access_code' => str_pad((string) rand(0, 999999), 6, '0', STR_PAD_LEFT), // Secure access code
                    'credit_limit' => (int) ($data['total_amount'] * 0.2), // Credit limit defaults to 20% of booking amount
                    'source_of_stay' => $data['source'],
                    'source_module' => 'channel_manager',
                    'external_reservation_id' => $externalId,
                    'staff_member' => 'API Gateway',
                ]);
            ]);

            // Simulate WhatsApp Notification Trigger
            Log::info("WhatsApp dispatch triggered", [
                'recipient' => $reservation->guest_phone,
                'template' => 'reservation_confirm',
                'variables' => [
                    'guest_name' => $reservation->guest_name,
                    'security_pin' => $reservation->security_pin,
                    'access_code' => $reservation->access_code,
                    'check_in_date' => $reservation->check_in_date instanceof \Carbon\Carbon ? $reservation->check_in_date->format('Y-m-d') : $reservation->check_in_date,
                ]
            ]);

            return response()->json([
                'success' => true,
                'message' => 'External reservation successfully ingested and mapped.',
                'data' => $reservation,
                'idempotency_status' => 'CREATED'
            ], 201);

        } catch (\Exception $e) {
            Log::error("Failed to ingest channel manager reservation: " . $e->getMessage());
            return response()->json([
                'error' => 'Internal server error occurred while writing reservation.',
                'message' => $e->getMessage(),
                'code' => 'TRANSACTION_FAILED'
            ], 500);
        }
    }
}
