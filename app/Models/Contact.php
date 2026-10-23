<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    //
    namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'contacts';
    protected $fillable = ['property_id', 'name', 'email', 'phone', 'message'];

    // Relación: Un mensaje de contacto está asociado a una propiedad
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
