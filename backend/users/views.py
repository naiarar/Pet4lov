from django.shortcuts import render
from rest_framework import generics
from .models import Users
from serializers import UsersSerializer
# Create your views here.

class UsersListCreate(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer


class UsersRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer