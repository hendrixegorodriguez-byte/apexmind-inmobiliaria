<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    /**
     * Muestra la lista de propiedades con sus relaciones.
     */
    public function index()
    {
        // Trae las propiedades junto con su tipo, municipio y agente asignado
        $properties = Property::with(['propertyType', 'municipality', 'agent'])->get();

        return response()->json([
            'success' => true,
            'data' => $properties
        ], 200);
    }

    /**
     * Muestra el detalle de una propiedad específica por su ID.
     */
    public function show($id)
    {
        $property = Property::with(['propertyType', 'municipality', 'agent'])->find($id);

        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Propiedad no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $property
        ], 200);
    }
}