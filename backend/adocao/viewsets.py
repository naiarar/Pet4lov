from rest_framework import viewsets
from adocao import serializers
from adocao import models
from rest_framework.filters import OrderingFilter


class OngsViewsets(viewsets.ModelViewSet):
    serializer_class = serializers.ONGSerializer
    queryset = models.ONG.objects.all()
    filter_backends = [OrderingFilter]
    odering_fields = ['cidade']


class PetsViewset(viewsets.ModelViewSet):
    serializer_class = serializers.PetSerializer
    queryset = models.ONG.objects.all()
    filter_backends = [OrderingFilter]
    odering_fields = ['type']

    
