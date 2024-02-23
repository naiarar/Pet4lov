from rest_framework import serializers
from .models import UsuarioAdmin,ONG, Pet, UsuarioAdotante

class UsuarioAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioAdmin
        fields = '__all__'

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
