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
    namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $table = 'properties';
    protected $fillable = ['title', 'description', 'price', 'location', 'rooms', 'bathrooms', 'agent_id'];

    // Relación: Una propiedad pertenece a un agente
    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    // Relación: Una propiedad tiene muchas imágenes
    public function images()
    {
        return $this->hasMany(Image::class);
    }

    // Relación: Favoritos de los usuarios
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}