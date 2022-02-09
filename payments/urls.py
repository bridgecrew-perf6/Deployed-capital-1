from django.urls import path
from .views import *

urlpatterns = [
    path('create-charge/', checkout, name="create_charge"),
]
