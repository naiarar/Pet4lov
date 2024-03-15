from rest_framework import viewsets, generics, status
from .models import Usuario, ONG, Pet
from .serializers import UsuarioSerializer, ONGSerializer, PetSerializer
from rest_framework.response import Response
from rest_framework import authentication, permissions


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioListCreate(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = []

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
    
    def get_permissions(self):
        if self.action == 'partial_update' or self.action == 'create':
            return [permissions.IsAuthenticated()]
        else:
            return []

    def get_queryset(self):
        queryset = ONG.objects.all()
        resposable = self.request.query_params.get('resposable')

        if resposable:
            queryset = queryset.filter(resposable=resposable)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        queryset = ONG.objects.all().filter(resposable=self.request.user)
        
        if (self.request.user != serializer.validated_data["resposable"]):
            return Response(status=401, data={'details': 'Not the responsable'})
        
        
        if queryset.count()> 0:
            return Response(status=400, data={'details': 'Ja existe uma ong pra esse responsavel'}) 
        
        
        self.perform_create(serializer)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        if (instance.resposable != self.request.user):
            return Response(status=401, data={'details': 'Not the responsable'})
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(ONGSerializer(instance).data)
    
    
class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
   
    def get_permissions(self):
        print(self.action)
        if self.action == 'partial_update' or self.action == 'create':
            return [permissions.IsAuthenticated()]
        else:
            return []
   
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if (self.request.user != serializer.validated_data["responsable_pet"]):
            return Response(status=401, data={'details': 'Not the responsable'})
               
        self.perform_create(serializer)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        if (instance.responsable_pet != self.request.user):
            return Response(status=401, data={'details': 'Not the responsable'})
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(PetSerializer(instance).data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if (instance.responsable_pet != self.request.user):
            return Response(status=401, data={'details': 'Not the responsable'})
        
        self.perform_destroy(instance)
        
        return Response(status=status.HTTP_204_NO_CONTENT)