from rest_framework import serializers
from .models import ONG, Pet, UsuarioAdotante
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class ONGSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=100, min_length=6)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        instance.is_active = True

        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = ONG
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field= 'email'
    
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        return attrs
    
class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'

class UsuarioAdotanteSerializer(serializers.ModelSerializer):
    # token = serializers.SerializerMethodField()
    password = serializers.CharField(max_length=100, min_length=6)

    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        instance.is_active = True

        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = UsuarioAdotante
        fields = '__all__'
