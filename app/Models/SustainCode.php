<?php

namespace App\Models;

use App\Traits\HasVersions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SustainCode extends Model
{
    use HasFactory, HasVersions;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
    ];
}
