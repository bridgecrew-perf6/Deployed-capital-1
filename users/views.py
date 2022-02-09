from datetime import datetime
from re import T, U
from django.shortcuts import render
from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Survey, User, AccessCode, DND
from .serializers import MyTokenObtainPairSerializer, UserSerializer, SurveySerializer, AccessCodeSerializer, DNDSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, login, logout
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.hashers import check_password, make_password
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
import secrets

class ObtainTokenPairWithEmailView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def logout_method(request):
    logout(request)
    return Response({'ok': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    import json

    if request.user:
        user_serializer = UserSerializer(request.user).data
        users = User.objects.exclude(pk=request.user.id)
        dnd_users = request.user.dnd_users.all()
        user_serializer_arr = UserSerializer(users, many=True)
        dnd_serializer = DNDSerializer(dnd_users, many=True)
        user_list = user_serializer_arr.data
        user_list.extend(dnd_serializer.data)
        all_users = []
        for user_obj in user_list:
            temp = {}
            if 'password' not in user_obj:
                temp['do_not_disturb'] = True 
                temp['username'] = user_obj.get('name', '-')
            else:
                temp['do_not_disturb'] = False
                temp['username'] = user_obj['username']
            temp['phone_number'] = user_obj['phone_number']
            temp['profile_picture'] = user_obj.get('profile_picture', '')
            all_users.append(temp)
        return Response({'ok': True, 'user': user_serializer, 'is_logged_in': True, 'all_users': all_users})
    else:
        return Response({'ok': False, 'is_logged_in': False, 'all_users': []})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manage_users(request):
    """
    List all users
    """
    post_data = request.data
    user_id = post_data['user_id']
    users = User.objects.exclude(pk=user_id)
    serializer = UserSerializer(users, many=True)
    return Response({'ok': True, 'users': serializer.data})


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def user_list(request):
    """
    create a new user.
    """
    if request.method == 'POST':        
        post_data = request.data
        try:
            dnd_user_exists = DND.objects.get((Q(phone_number=post_data['phone_number'])))
            dnd_user_exists.delete()
        except DND.DoesNotExist:
            pass
        try:
            curr_user = User.objects.get((Q(phone_number=post_data['phone_number']) | Q(email=post_data['email']) | Q(username=post_data['username'])))
            curr_user.first_name = post_data.get('first_name')
            curr_user.last_name = post_data.get('last_name')
            curr_user.email = post_data.get('email')
            curr_user.username = post_data.get('username')
            curr_user.phone_number = post_data.get('phone_number')
            curr_user.birth_date = post_data.get('birth_date')
            curr_user.password = make_password(post_data.get('password'))
            curr_user.save() 
            return Response({ 'ok': True }, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            serializer = UserSerializer(data=post_data)
            if serializer.is_valid():
                serializer.save()
                return Response({ 'ok': True }, status=status.HTTP_201_CREATED)
            else:
                return Response({'ok': False, 'error': serializer.errors })

@api_view(['POST'])
@permission_classes([AllowAny])
def validate_email(request):

    post_data = request.data
    try:
        User.objects.get(email=post_data['email'])
        return Response({'ok': False})
    except User.DoesNotExist:
        return Response({'ok': True})

@api_view(['POST'])
@permission_classes([AllowAny])
def validate_email_username(request):

    post_data = request.data

    unique_email = User.objects.filter(email=post_data['email'])
    unique_username = User.objects.filter(username=post_data['username'])
    unique_phone_number = User.objects.filter(phone_number=post_data['phone_number'])

    if len(unique_email) >= 1 and len(unique_username) >= 1 and len(unique_phone_number) >=1:
        return Response({'ok': False, 'error': 'This email, username and phone number is already taken.'})
    elif len(unique_email) >= 1 and len(unique_username) >= 1:
        return Response({'ok': False, 'error': 'This email and username is already taken.'})
    elif len(unique_username) >= 1 and len(unique_phone_number) >= 1:
        return Response({'ok': False, 'error': 'This username and phone number is already taken.'})
    elif len(unique_email) >= 1 and len(unique_phone_number) >= 1:
        return Response({'ok': False, 'error': 'This email and phone number is already taken.'})
    elif len(unique_email) >= 1:
        return Response({'ok': False, 'error': 'This email is already taken.'})
    elif len(unique_username) >= 1:
        return Response({'ok': False, 'error': 'This username is already taken.'})
    elif len(unique_phone_number) >= 1:
        return Response({'ok': False, 'error': 'This number is already taken.'})
    else:
        return Response({'ok': True})

@api_view(['POST'])
@permission_classes([AllowAny])
def manage_survey(request):
    import json
    """
    Manage Surveys
    """
    if request.method == 'POST':        
        post_data = request.data
        post_data['survey_response'] = json.dumps(post_data['survey_response'])
        post_data['created_on'] = timezone.now() 
        user_id = post_data['user']
        user = User.objects.get(pk=user_id)
        if user:
            try:
                curr_survey = Survey.objects.get(user=user_id)
            except Survey.DoesNotExist:
                curr_survey = None
            if curr_survey:
                curr_survey.survey_response = post_data['survey_response']
                curr_survey.save()
                return Response({ 'ok': True })
            else:
                serializer = SurveySerializer(data=post_data)
                if serializer.is_valid():
                    serializer.save()
                    return Response({ 'ok': True })
                else:
                    return Response({'ok': False, 'error': serializer.errors })
                    
        return Response({'ok': False, 'error': 'Some error occured' })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manage_dnd(request):
    """
    Manage Do not disturb user list
    """
    if request.method == 'POST':        
        post_data = request.data
        curr_user = User.objects.get(pk=post_data['user_id'])
        all_dnd_users = curr_user.dnd_users.all()
        for user_obj in all_dnd_users:
            if user_obj.phone_number == post_data['phone_number']:
                return Response({'ok': False, 'error': 'User already present in your DND list.' })
        try:
            dnd_user_obj = DND(phone_number=post_data['phone_number'], name=post_data['name'], user=curr_user)
            dnd_user_obj.save()
            dnd_serializer = DNDSerializer(dnd_user_obj).data
            dnd_user = { 'username': dnd_serializer['name'], 'profile_picture': dnd_serializer.get('profile_picture', ''), 'email': '-', 'phone_number': dnd_serializer['phone_number'], 'do_not_disturb': True }
            return Response({'ok': True, 'user': dnd_user, 'error': None })
        except Exception as e:
            return Response({'ok': False, 'error': 'Some error occured.' })

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, pk):
    """
    Retrieve, update or delete a user.
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        post_data = request.data
        post_data['updated_on'] = timezone.now()
        all_email_ids = User.objects.exclude(email=post_data['email']).values_list('email', flat=True)
        all_usernames = User.objects.exclude(username=post_data['username']).values_list('username', flat=True)
        try:
            user_exists = User.objects.get(email=post_data['email'])
        except User.DoesNotExist:
            user_exists = None
        if user_exists: 
            err_msg = None
            if post_data['email'] in all_email_ids and post_data['username'] in all_usernames:
                err_msg = 'This email id and username both are already taken.'
            elif post_data['email'] in all_email_ids:
                err_msg = 'This email id is already taken.'
            elif post_data['username'] in all_usernames:
                err_msg = 'This username is already taken.'
            if err_msg:
                return Response({'ok': False, 'error': err_msg})
            else:
                serializer = UserSerializer(user, data=post_data)
                if serializer.is_valid():
                    serializer.save()
                    reqd_form_data = {
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email,
                        'username':user.username,
                        'birth_date':user.birth_date,
                        'phone_number':user.phone_number,
                        # 'do_not_disturb': user.do_not_disturb,
                        'profile_picture': user.profile_picture if user.profile_picture else '',
                    }
                    return Response({'ok': True, 'user': reqd_form_data, 'session_user': serializer.data})
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):

    post_data = request.data
    try:
        user_data = User.objects.get(email=post_data['email'])
    except:
        return Response({'ok': False, 'error': 'No such user found. Please enter a correct email.'})

    if user_data:
        user_data.set_password(post_data['password'])
        user_data.save()
        return Response({'ok': True})
    else:
        return Response({'ok': False})

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password_login(request):

    post_data = request.data
    try:
        user_data = User.objects.get(email=post_data['email'])
    except:
        return Response({'ok': False, 'error': 'No such user found. Please enter a correct email.'})

    if user_data:
        user_data.set_password(post_data['password'])
        user_data.save()
        return Response({'ok': True})
    else:
        return Response({'ok': False})

def generate_random_password(password_length):
    password = secrets.token_urlsafe(password_length)
    return make_password(password)
