from rest_framework import serializers
from accounts.models import CustomUser
from django.contrib.auth.hashers import make_password



class RegisterSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()
    password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):   
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        if password != confirm_password:
            raise serializers.ValidationError("Password didn't match")
        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            phone_number = validated_data['phone_number'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            email = validated_data['email'],
            password = validated_data['password'],
            is_active = False,
        )
        code = user.generate_verify_code()
        return {
            'message': 'Confirmation code is sent to your email',
            'code': code
        }
    
class RegisterVerifySerializer(serializers.Serializer):
    email = serializers.CharField()
    code = serializers.CharField()

class ResendCodeSerializer(serializers.Serializer):
    email = serializers.CharField()

class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.CharField()

class PasswordResetVerifySerializer(serializers.Serializer):
    code = serializers.CharField()

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.CharField()
    new_password = serializers.CharField()
    confirm_password = serializers.CharField()

    def validate(self, data):
        new_password = data['new_password']
        confirm_password = data['confirm_password']
        if new_password != confirm_password:
            raise serializers.ValidationError("Password didn't match")
        confirm_password = make_password(confirm_password)
        return data