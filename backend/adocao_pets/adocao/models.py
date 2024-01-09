from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4

def upload_image_animal(instance, filename):
    return f"{instance.id_animal}-{filename}"

# Create your models here.
class ONG(models.Model):
    id_ong = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=100)
    responsavel = models.CharField(max_length=100)
    endereco = models.TextField()
    cidade = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)


class Animal(models.Model):
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

class UsuarioAdopt(models.Model):
    id_user = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    animal_adotado = models.ForeignKey(Animal, on_delete=models.SET_NULL, null=True, blank=True)
    document_cpf = models.BigIntegerField (blank=True, null=True)
    birth_date = models.DateField(auto_now_add=False, null=False)
    adress = models.CharField(max_length=50, blank=True,null=True)
    email = models.CharField(max_length=50, blank=True,null=True)
    contact = models.CharField(max_length=50, blank=True,null=True)

