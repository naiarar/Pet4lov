from rest_framework import viewsets, generics
from .models import Usuario, ONG, Pet
from .serializers import UsuarioSerializer, ONGSerializer, PetSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioListCreate(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

    def patch(self, request, *args, **kwargs):
        Usuario_serializer_update = UsuarioSerializer(
            instance=request.Usuario,
            data=request.data,
            partial=True
        )
        if Usuario_serializer_update.is_valid():
            Usuario_serializer_update.save()

class ONGViewSet(viewsets.ModelViewSet):
    queryset = ONG.objects.all()
    serializer_class = ONGSerializer

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
