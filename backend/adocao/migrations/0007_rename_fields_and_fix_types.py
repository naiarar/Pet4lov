import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adocao', '0006_pet_responsable_pet'),
    ]

    operations = [
        migrations.RenameField(model_name='usuario', old_name='adress', new_name='address'),
        migrations.RenameField(model_name='ong', old_name='adress', new_name='address'),
        migrations.RenameField(model_name='ong', old_name='resposable', new_name='responsible'),
        migrations.RenameField(model_name='pet', old_name='responsable_pet', new_name='responsible'),
        migrations.RenameField(model_name='pet', old_name='vacine_status', new_name='vaccination_status'),
        migrations.RenameField(model_name='pet', old_name='vermifugue_status', new_name='deworming_status'),
        migrations.AlterField(
            model_name='usuario',
            name='address',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='document_cpf',
            field=models.CharField(blank=True, max_length=11, null=True),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='email',
            field=models.EmailField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='usuario',
            name='password',
            field=models.CharField(max_length=128, verbose_name='password'),
        ),
        migrations.AlterField(
            model_name='ong',
            name='responsible',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ongs', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='pet',
            name='responsible',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pets', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='pet',
            name='ong',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pets', to='adocao.ong'),
        ),
        migrations.AlterField(
            model_name='pet',
            name='adoption_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterModelOptions(name='ong', options={'ordering': ['name']}),
        migrations.AlterModelOptions(name='pet', options={'ordering': ['name_animal']}),
    ]
