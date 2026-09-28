from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import ONG, Pet, Usuario
from .permissions import IsOwnerOrReadOnly, IsSelf
from .serializers import ONGSerializer, PetSerializer, UsuarioSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated, IsSelf]
    http_method_names = ["get", "put", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return Usuario.objects.filter(pk=self.request.user.pk)

    @action(detail=False, methods=["get"])
    def me(self, request):
        return Response(self.get_serializer(request.user).data)


class UsuarioCreate(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]


class ONGViewSet(viewsets.ModelViewSet):
    queryset = ONG.objects.all()
    serializer_class = ONGSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ["responsible", "city", "state"]
    search_fields = ["name", "city"]
    owner_field = "responsible"

    def perform_create(self, serializer):
        if ONG.objects.filter(responsible=self.request.user).exists():
            raise ValidationError({"detail": "Já existe uma ONG cadastrada para este responsável."})
        serializer.save(responsible=self.request.user)


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.select_related("ong")
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filterset_fields = ["ong", "type", "city", "state", "responsible"]
    search_fields = ["name_animal", "breed", "city"]
    owner_field = "responsible"

    def perform_create(self, serializer):
        serializer.save(responsible=self.request.user)
