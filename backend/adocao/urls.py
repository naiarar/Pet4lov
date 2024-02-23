from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioAdminViewSet, UsuarioAdotanteViewSet, ONGViewSet, PetViewSet

router = DefaultRouter()
router.register(r'admin', UsuarioAdminViewSet)
router.register(r'usuarios', UsuarioAdotanteViewSet)
router.register(r'ongs', ONGViewSet)
router.register(r'pets', PetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

