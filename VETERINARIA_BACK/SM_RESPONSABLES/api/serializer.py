from rest_framework import serializers
from .models import Responsables

class ResponsablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsables
        fields = "__all__"