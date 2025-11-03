from rest_framework import serializers
from .models import Veterinarias

class VeterinariasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veterinarias
        fields = '__all__'