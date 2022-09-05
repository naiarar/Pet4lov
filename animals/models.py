from django.db import models
from uuid import uuid4
# Create your models here.

class Animals(models.Model):
    id_animal = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    type = models.CharField(max_length = 50)
    color = models.CharField(max_length = 20)
    breed = models.CharField(max_length = 50)
    birth_date = models.IntegerField()
    adoption_date = models.DateTimeField(auto_now_add=True)
    health_condition = models.CharField(max_length = 200)




