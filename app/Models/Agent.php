<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;

    protected $table = 'agents';
    protected $guarded = [];

    // Relación: Un agente tiene muchas propiedades
    public function properties()
    {
        return $this->hasMany(Property::class, 'agent_id');
    }
    namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $table = 'agents';
    protected $fillable = ['user_id', 'phone', 'agency'];

    // Relación: Un agente pertenece a un usuario registrado
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación: Un agente tiene muchas propiedades publicadas
    public function properties()
    {
        return $this->hasMany(Property::class);
    }
}