from uuid import uuid4

from django.contrib.auth.models import AbstractUser
from django.db import models


def upload_image_animal(instance, filename):
    return f"pets/{instance.id_animal}-{filename}"


class Usuario(AbstractUser):
    id_user = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=100)
    document_cpf = models.CharField(max_length=11, blank=True, null=True)
    birth_date = models.DateField(null=True)
    address = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    contact = models.CharField(max_length=50, blank=True, null=True)
    username = models.CharField(max_length=100)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.name or self.email


class ONG(models.Model):
    id_ong = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=100)
    responsible = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="ongs")
    document = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Pet(models.Model):
    id_animal = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    responsible = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="pets")
    ong = models.ForeignKey(ONG, on_delete=models.CASCADE, related_name="pets")
    state = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    type = models.CharField(max_length=50)
    name_animal = models.CharField(max_length=200, blank=True, null=True)
    color = models.CharField(max_length=20)
    breed = models.CharField(max_length=50)
    birth_date = models.DateField()
    adoption_date = models.DateField(null=True, blank=True)
    health_condition = models.CharField(max_length=200)
    vaccination_status = models.CharField(max_length=50, blank=True, null=True)
    deworming_status = models.CharField(max_length=50, blank=True, null=True)
    observations = models.CharField(max_length=250, blank=True, null=True)
    image = models.ImageField(upload_to=upload_image_animal, blank=True, null=True)

    class Meta:
        ordering = ["name_animal"]

    def __str__(self):
        return self.name_animal or str(self.id_animal)
