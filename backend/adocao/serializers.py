from rest_framework import serializers
from .models import Usuario,ONG, Pet
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UsuarioSerializer(serializers.ModelSerializer):
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
        model = Usuario
        fields = '__all__'

class UsuarioResSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [ "email", "id_user" , "name"]    
class ONGSerializer(serializers.ModelSerializer):

    class Meta:
        model = ONG
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field= 'email'
    
    def validate(self, attrs) :
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        user = UsuarioResSerializer(self.user)
        # user.Meta.fields  = [ "email", "id_user" ]
        data["user"] = user.data
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data
    
class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'
