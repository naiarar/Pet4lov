from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, ONGViewSet, PetViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'ongs', ONGViewSet, basename='ong')
router.register(r'pets', PetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

