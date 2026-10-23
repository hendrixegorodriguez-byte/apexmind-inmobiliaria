<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    //
    namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';
    protected $fillable = ['property_id', 'image_url'];

    // Relación: Una imagen pertenece a una propiedad
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
