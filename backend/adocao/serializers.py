from rest_framework import serializers
from .models import ONG, Pet, UsuarioAdotante

class ONGSerializer(serializers.ModelSerializer):
    class Meta:
        model = ONG
        fields = '__all__'

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'

class UsuarioAdotanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioAdotante
        fields = '__all__'
