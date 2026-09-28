from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import ONG, Pet, Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, write_only=True, validators=[validate_password])
    document_cpf = serializers.RegexField(r"^\d{11}$", required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Usuario
        fields = [
            "id_user",
            "name",
            "username",
            "email",
            "document_cpf",
            "birth_date",
            "address",
            "contact",
            "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        instance = Usuario(**validated_data)
        instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        instance = super().update(instance, validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance


class UsuarioResSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["email", "id_user", "name"]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UsuarioResSerializer(self.user).data
        return data


class ONGSerializer(serializers.ModelSerializer):
    class Meta:
        model = ONG
        fields = "__all__"
        read_only_fields = ["responsible"]


class PetSerializer(serializers.ModelSerializer):
    ong_name = serializers.CharField(source="ong.name", read_only=True)
    ong_email = serializers.EmailField(source="ong.email", read_only=True)

    class Meta:
        model = Pet
        fields = "__all__"
        read_only_fields = ["responsible"]

    def validate_ong(self, ong):
        if ong.responsible != self.context["request"].user:
            raise serializers.ValidationError("Você só pode cadastrar pets na sua própria ONG.")
        return ong
