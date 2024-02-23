from rest_framework import viewsets
from .models import UsuarioAdotante, ONG, Pet
from .serializers import UsuarioAdotanteSerializer, ONGSerializer, PetSerializer


class UsuarioAdotanteViewSet(viewsets.ModelViewSet):
    queryset = UsuarioAdotante.objects.all()
    serializer_class = UsuarioAdotanteSerializer

class ONGViewSet(viewsets.ModelViewSet):
    queryset = ONG.objects.all()
    serializer_class = ONGSerializer

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
