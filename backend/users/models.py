from django.db import models
from uuid import uuid4

# Create your models here.
class Users(models.Model):
    id_user = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=50, blank=True,null=True)
    document_cpf = models.BigIntegerField (blank=True, null=True)
    birth_date = models.DateField(auto_now_add=False, null=False)
    adress = models.CharField(max_length=50, blank=True,null=True)
    email = models.CharField(max_length=50, blank=True,null=True)
    contact = models.CharField(max_length=50, blank=True,null=True)
