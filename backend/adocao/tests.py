import io
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ONG, Pet, Usuario

MEDIA_ROOT = tempfile.mkdtemp()


def png_file(name="rex.png"):
    buffer = io.BytesIO()
    Image.new("RGB", (1, 1)).save(buffer, format="PNG")
    return SimpleUploadedFile(name, buffer.getvalue(), content_type="image/png")


def create_user(email, password="senha-forte-123"):
    return Usuario.objects.create_user(email=email, username=email, password=password, name=email)


def create_ong(owner, email="ong@pet4lov.com"):
    return ONG.objects.create(
        name="ONG Patinhas",
        responsible=owner,
        document="12345678000199",
        address="Rua A, 1",
        city="São Paulo",
        state="SP",
        email=email,
    )


PET_FIELDS = {
    "name_animal": "Rex",
    "type": "Cachorro",
    "breed": "SRD",
    "color": "Caramelo",
    "birth_date": "2021-05-10",
    "health_condition": "Saudável",
    "city": "São Paulo",
    "state": "SP",
}


def pet_payload(ong, **extra):
    return {"ong": str(ong.pk), **PET_FIELDS, **extra}


def create_pet(ong, **extra):
    return Pet.objects.create(ong=ong, responsible=ong.responsible, **{**PET_FIELDS, **extra})


class RegisterAndLoginTests(APITestCase):
    def test_register_ignores_privileged_fields_and_hides_password(self):
        response = self.client.post(
            "/api/register/",
            {
                "name": "Ana",
                "username": "ana",
                "email": "ana@pet4lov.com",
                "password": "senha-forte-123",
                "document_cpf": "01234567890",
                "is_superuser": True,
                "is_staff": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotIn("password", response.data)
        user = Usuario.objects.get(email="ana@pet4lov.com")
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)
        self.assertEqual(user.document_cpf, "01234567890")
        self.assertTrue(user.check_password("senha-forte-123"))

    def test_register_rejects_invalid_cpf(self):
        response = self.client.post(
            "/api/register/",
            {"name": "Ana", "username": "ana", "email": "ana@pet4lov.com", "password": "senha-forte-123", "document_cpf": "123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("document_cpf", response.data)

    def test_register_rejects_weak_password(self):
        response = self.client.post(
            "/api/register/",
            {"name": "Ana", "username": "ana", "email": "ana@pet4lov.com", "password": "123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_login_returns_tokens_and_user(self):
        create_user("ana@pet4lov.com")

        response = self.client.post(
            "/api/auth/obtain/", {"email": "ana@pet4lov.com", "password": "senha-forte-123"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "ana@pet4lov.com")

    def test_login_with_wrong_password_fails(self):
        create_user("ana@pet4lov.com")

        response = self.client.post("/api/auth/obtain/", {"email": "ana@pet4lov.com", "password": "errada"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UsuarioTests(APITestCase):
    def setUp(self):
        self.ana = create_user("ana@pet4lov.com")
        self.bia = create_user("bia@pet4lov.com")

    def test_anonymous_cannot_list_users(self):
        self.assertEqual(self.client.get("/api/usuarios/").status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_logged_user(self):
        self.client.force_authenticate(self.ana)

        response = self.client.get("/api/usuarios/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "ana@pet4lov.com")

    def test_user_cannot_see_or_edit_another_user(self):
        self.client.force_authenticate(self.ana)

        self.assertEqual(self.client.get(f"/api/usuarios/{self.bia.pk}/").status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            self.client.patch(f"/api/usuarios/{self.bia.pk}/", {"name": "x"}, format="json").status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_password_update_is_hashed(self):
        self.client.force_authenticate(self.ana)

        response = self.client.patch(f"/api/usuarios/{self.ana.pk}/", {"password": "nova-senha-456"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ana.refresh_from_db()
        self.assertTrue(self.ana.check_password("nova-senha-456"))


class ONGTests(APITestCase):
    def setUp(self):
        self.ana = create_user("ana@pet4lov.com")
        self.bia = create_user("bia@pet4lov.com")
        self.payload = {
            "name": "ONG Patinhas",
            "document": "12345678000199",
            "address": "Rua A, 1",
            "city": "São Paulo",
            "state": "SP",
            "email": "ong@pet4lov.com",
        }

    def test_anonymous_can_list_but_not_create(self):
        self.assertEqual(self.client.get("/api/ongs/").status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.post("/api/ongs/", self.payload, format="json").status_code, status.HTTP_401_UNAUTHORIZED)

    def test_responsible_comes_from_logged_user(self):
        self.client.force_authenticate(self.ana)

        response = self.client.post("/api/ongs/", {**self.payload, "responsible": str(self.bia.pk)}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ONG.objects.get().responsible, self.ana)

    def test_only_one_ong_per_responsible(self):
        create_ong(self.ana)
        self.client.force_authenticate(self.ana)

        response = self.client.post("/api/ongs/", {**self.payload, "email": "outra@pet4lov.com"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_only_owner_can_change_or_delete(self):
        ong = create_ong(self.ana)

        self.assertEqual(self.client.delete(f"/api/ongs/{ong.pk}/").status_code, status.HTTP_401_UNAUTHORIZED)
        self.client.force_authenticate(self.bia)
        self.assertEqual(self.client.delete(f"/api/ongs/{ong.pk}/").status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(self.ana)
        self.assertEqual(
            self.client.patch(f"/api/ongs/{ong.pk}/", {"city": "Campinas"}, format="json").status_code, status.HTTP_200_OK
        )
        self.assertEqual(self.client.delete(f"/api/ongs/{ong.pk}/").status_code, status.HTTP_204_NO_CONTENT)

    def test_filter_by_responsible(self):
        create_ong(self.ana)
        create_ong(self.bia, email="bia-ong@pet4lov.com")

        response = self.client.get(f"/api/ongs/?responsible={self.ana.pk}")

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["responsible"], self.ana.pk)


@override_settings(MEDIA_ROOT=MEDIA_ROOT)
class PetTests(APITestCase):
    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(MEDIA_ROOT, ignore_errors=True)
        super().tearDownClass()

    def setUp(self):
        self.ana = create_user("ana@pet4lov.com")
        self.bia = create_user("bia@pet4lov.com")
        self.ong = create_ong(self.ana)

    def test_owner_creates_pet_with_image(self):
        self.client.force_authenticate(self.ana)
        response = self.client.post("/api/pets/", pet_payload(self.ong, image=png_file()), format="multipart")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["ong_name"], "ONG Patinhas")
        pet = Pet.objects.get()
        self.assertEqual(pet.responsible, self.ana)
        self.assertTrue(pet.image.name.startswith("pets/"))

    def test_cannot_create_pet_in_another_users_ong(self):
        self.client.force_authenticate(self.bia)

        response = self.client.post("/api/pets/", pet_payload(self.ong), format="multipart")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("ong", response.data)

    def test_anonymous_can_list_and_filter(self):
        create_pet(self.ong)
        create_pet(self.ong, name_animal="Mimi", type="Gato")

        self.assertEqual(len(self.client.get("/api/pets/").data), 2)
        self.assertEqual([p["name_animal"] for p in self.client.get("/api/pets/?type=Gato").data], ["Mimi"])
        self.assertEqual([p["name_animal"] for p in self.client.get("/api/pets/?search=rex").data], ["Rex"])

    def test_only_owner_can_change_or_delete(self):
        pet = create_pet(self.ong)

        self.client.force_authenticate(self.bia)
        self.assertEqual(self.client.delete(f"/api/pets/{pet.pk}/").status_code, status.HTTP_403_FORBIDDEN)
        self.client.force_authenticate(self.ana)
        self.assertEqual(
            self.client.patch(f"/api/pets/{pet.pk}/", {"color": "Preto"}, format="json").status_code, status.HTTP_200_OK
        )
        self.assertEqual(self.client.delete(f"/api/pets/{pet.pk}/").status_code, status.HTTP_204_NO_CONTENT)
