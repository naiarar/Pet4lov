from rest_framework import serializers
from animals import models

class AnimalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Animals
        fields = '__all__'