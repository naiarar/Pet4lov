# Generated by Django 4.1.1 on 2022-09-07 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('animals', '0002_animals_image_animals_name_animal_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='animals',
            name='observations',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
        migrations.AddField(
            model_name='animals',
            name='vacine_status',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='animals',
            name='vermifugue_status',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='animals',
            name='birth_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='animals',
            name='name_animal',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
