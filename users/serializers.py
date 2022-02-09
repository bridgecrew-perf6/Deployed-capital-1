from rest_framework import serializers
from .models import User, Survey, AccessCode, DND
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate, login, logout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = '__all__'

class AccessCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = AccessCode
        fields = '__all__'

class DNDSerializer(serializers.ModelSerializer):

    class Meta:
        model = DND
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):

        post_data = dict(attrs)
        data = dict()
        request_data = self.context['request'].data
        
        if 'type' in request_data and request_data['type'] == 'sso':
            try:
                self.user = User.objects.get(email=post_data['email'])
            except User.DoesNotExist:
                data['ok'] = False
                data['error'] = 'No such user exists.'
                return data
        else:
            self.user = authenticate(self.context['request'], email=post_data['email'], password=post_data['password'])
        if self.user:

            users = User.objects.exclude(pk=self.user.id)
            dnd_users = self.user.dnd_users.all()
            user_serializer = UserSerializer(users, many=True)
            dnd_serializer = DNDSerializer(dnd_users, many=True)
            user_list = user_serializer.data
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
            data = super().validate(attrs)
            refresh = self.get_token(self.user)
            user_serializer = UserSerializer(self.user).data
            if self.user.is_superuser:
                data['is_admin'] = True
                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                data['user'] = user_serializer
                data['all_users'] = all_users
                data['ok'] = True
            else:
                # if self.user.is_verified:
                data['refresh'] = str(refresh)
                data['access'] = str(refresh.access_token)
                data['user'] = user_serializer
                data['all_users'] = all_users
                data['ok'] = True
                # else:
                #     data['ok'] = False
                #     data['error'] = 'Please verify this account first by clicking the verification link sent to your registered email address.'
        else:
            data['ok'] = False
            data['error'] = 'Invalid Credentials.'
        return data