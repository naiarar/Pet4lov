# Generated by Django 5.0.2 on 2024-03-12 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adocao', '0002_alter_usuario_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='birth_date',
            field=models.DateField(null=True),
        ),
    ]