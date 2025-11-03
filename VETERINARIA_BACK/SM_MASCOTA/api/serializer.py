from rest_framework import serializers
from .models import Mascotas
import re

class MascotasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascotas
        fields = "__all__"

    #Validacion personalizada para el campo edad
    def validate_edad(self, value):
        # permitir 0 (recién nacido) pero no valores negativos
        if value < 0:
            raise serializers.ValidationError("La edad no puede ser negativa")
        return value
    
    #Validacion personalizada para el campo nombre
    def validate_nombre(self, value):
        # Normalizar espacios en los extremos
        value = value.strip()
        if not value:
            raise serializers.ValidationError("El nombre es requerido")

        # Permitir letras (incluye acentos en el rango Latin-1), espacios y guiones
        # isalpha() falla si hay espacios o caracteres especiales (por eso usamos regex)
        pattern = r'^[A-Za-zÀ-ÖØ-öø-ÿÑñÜü\s\-]+$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("El nombre solo debe contener letras, espacios o guiones")
        return value