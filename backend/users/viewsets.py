from rest_framework import viewsets
from users import serializers
from users import models

class UsersViewsets(viewsets.ModelViewSet):
    serializer_class = serializers.UsersSerializer
    queryset = models.User.objects.all()