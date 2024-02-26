from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from uuid import uuid4

def upload_image_animal(instance, filename):
    return f"{instance.id_animal}-{filename}"

# Create your models here.


class Usuario(AbstractUser):
    id_user = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=100)
    document_cpf = models.BigIntegerField (blank=True, null=True)
    birth_date = models.DateField(auto_now_add=False, null=False)
    adress = models.CharField(max_length=50, blank=True,null=True)
    email = models.CharField(max_length=100, unique=True)
    contact = models.CharField(max_length=50, blank=True,null=True)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['USERNAME_FIELD']

class ONG(models.Model):
    id_ong = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=100)
    resposable = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    document = models.CharField(max_length=100)
    adress = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)


class Pet(models.Model):
    ong = models.ForeignKey(ONG, on_delete=models.CASCADE)
    id_animal = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    state = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    type = models.CharField(max_length = 50)
    name_animal = models.CharField(max_length=200, blank=True,null=True)
    color = models.CharField(max_length = 20)
    breed = models.CharField(max_length = 50) #raça
    birth_date = models.DateField(auto_now_add=False, null=False)
    adoption_date = models.DateTimeField(auto_now_add=True, null=True)
    health_condition = models.CharField(max_length = 200)
    vacine_status = models.CharField(max_length=50, blank=True,null=True)
    vermifugue_status = models.CharField(max_length=50, blank=True,null=True)
    observations = models.CharField(max_length=250, blank=True,null=True)
    image = models.ImageField(upload_to= upload_image_animal, blank=True, null=True)


