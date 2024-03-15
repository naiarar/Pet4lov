from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from adocao.views import UsuarioListCreate
from adocao_pets.views import hello_world
urlpatterns = [
    path('api/auth/obtain/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', admin.site.urls),
    path('api/register/', UsuarioListCreate.as_view(), name="Criar-Usuario"),
    path('api/', include('adocao.urls')),
    path('hello', hello_world)
]


