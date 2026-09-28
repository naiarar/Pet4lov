from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import ONG, Pet, Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    ordering = ["email"]
    list_display = ["email", "name", "is_staff"]
    search_fields = ["email", "name"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Dados pessoais", {"fields": ("name", "username", "document_cpf", "birth_date", "address", "contact")}),
        ("Permissões", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "name", "username", "password1", "password2")}),
    )


@admin.register(ONG)
class ONGAdmin(admin.ModelAdmin):
    list_display = ["name", "city", "state", "responsible"]
    search_fields = ["name", "city"]


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ["name_animal", "type", "breed", "ong", "city"]
    list_filter = ["type", "state"]
    search_fields = ["name_animal", "breed"]
