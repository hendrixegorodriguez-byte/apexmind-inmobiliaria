<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $table = 'properties'; // Apunta a tu tabla en MySQL
    protected $guarded = [];

    // Relación: Una propiedad pertenece a un tipo (PropertyType)
    public function propertyType()
    {
        return $this->belongsTo(PropertyType::class, 'property_type_id');
    }

    // Relación: Una propiedad pertenece a un municipio
    public function municipality()
    {
        return $this->belongsTo(Municipality::class, 'municipality_id');
    }

    // Relación: Una propiedad pertenece a un agente
    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }
}