from rest_framework import viewsets
from animals.api import serializers
from animals import models

class AnimalsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AnimalsSerializer
    queryset = models.Animals.objects.all()