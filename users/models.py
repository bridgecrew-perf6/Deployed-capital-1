from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

AUTH_USER_MODEL = getattr(settings, "AUTH_USER_MODEL", "auth.User")

class User(AbstractUser):

    first_name = models.CharField(max_length=50, null=True, default=None)
    last_name = models.CharField(max_length=50, null=True, default=None)
    email = models.EmailField(_('email address'), unique=True, null=False)
    created_on = models.DateTimeField(default=timezone.now)
    updated_on = models.DateTimeField(default=timezone.now)
    birth_date = models.DateTimeField(default=None, null=True)
    phone_number = models.CharField(max_length=12, null=False, default=None, unique=True)
    profile_picture = models.TextField(null=True, default='', blank=True)
    last_passwords = models.TextField(null=True)
    expiry_token = models.CharField(max_length=50, null=True, default=None)
    expiry_date = models.DateTimeField(null=True)
    sso = models.BooleanField(null=True)
    locked = models.BooleanField(null=True)
    provider = models.CharField(max_length=20, null=True)
    last_login = models.DateTimeField(null=True)
    is_verified = models.BooleanField(null=False, default=False)
    username = models.CharField(max_length=20, unique=True, null=False, default='')

    USERNAME_FIELD = 'email'    
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Survey(models.Model):

    survey_response = models.TextField(blank=False, default='')
    created_on = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        User, related_name='surveys', on_delete=models.CASCADE)

class AccessCode(models.Model):

    access_code = models.CharField(max_length=20, null=True, default=None)
    user = models.ForeignKey(
        User, related_name='access_codes', on_delete=models.CASCADE)

class Commission(models.Model):

    commissions = models.IntegerField(default=0)
    created_on = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(
        User, related_name='commissions', on_delete=models.CASCADE)

class DND(models.Model):

    name = models.CharField(max_length=20, null=True, unique=False, default=None)
    phone_number = models.CharField(max_length=12, null=True, unique=True, default=None)
    user = models.ForeignKey(
        User, related_name='dnd_users', on_delete=models.CASCADE, null=True)