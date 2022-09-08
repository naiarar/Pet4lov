# Generated by Django 4.1.1 on 2022-09-06 14:58

import animals.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('animals', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='animals',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=animals.models.upload_image_animal),
        ),
        migrations.AddField(
            model_name='animals',
            name='name_animal',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='animals',
            name='adoption_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]