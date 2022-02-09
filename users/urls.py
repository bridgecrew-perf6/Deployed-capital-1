from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import *

urlpatterns = [
    
    path('login/', ObtainTokenPairWithEmailView.as_view(), name='token_create'),  
    path('logout/', logout_method),
    path('is_authenticated/', is_authenticated),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('validate_email/', validate_email),
    path('validate_email_username/', validate_email_username),
    path('register/', user_list),
    path('manage_users/', manage_users),
    path('modify_profile/<int:pk>', user_detail),
    path('change_password/', change_password),
    path('reset_password_login/', reset_password_login),
    path('manage_survey/', manage_survey),
    path('manage_dnd/', manage_dnd)
]