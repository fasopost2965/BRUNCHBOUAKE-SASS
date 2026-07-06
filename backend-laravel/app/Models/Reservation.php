<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Reservation extends Model
{
    use HasUuids;

    protected $fillable = [
        'id',
        'tenant_id',
        'room_id',
        'guest_name',
        'guest_phone',
        'guest_email',
        'check_in_date',
        'check_out_date',
        'number_of_guests',
        'status',
        'total_amount',
        'paid_amount',
        'payment_status',
        'special_requests',
        'security_pin',
        'access_code',
        'credit_limit',
        'nationality',
        'id_number',
        'address',
        'source_of_stay',
        'staff_member',
        'source_module',
        'external_reservation_id',
    ];

    protected $casts = [
        'number_of_guests' => 'integer',
        'total_amount' => 'integer',
        'paid_amount' => 'integer',
        'credit_limit' => 'integer',
        'check_in_date' => 'date:Y-m-d',
        'check_out_date' => 'date:Y-m-d',
    ];

    /**
     * Scope query to only include records for a specific tenant.
     */
    public function scopeForTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    /**
     * Get the room linked with this reservation.
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
