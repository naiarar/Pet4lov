from django.db import models
from uuid import uuid4

def upload_image_animal(instance, filename):
    return f"{instance.id_animal}-{filename}"

class Animals(models.Model):
    id_animal = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    ong_responsible = models.CharField(max_length=15, null=False, blank=False)
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



class Doacao(models.Model):
    id_doacao = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    id_user = models.UUIDField(blank=False,null=False,editable=False)
    id_animal = models.UUIDField(blank=False,null=False,editable=False)

class Adocao(models.Model):
    id_adocao = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    id_doacao = models.UUIDField(blank=False,null=False,editable=False)
    id_user = models.UUIDField(blank=False,null=False,editable=False)






