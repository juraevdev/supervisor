from rest_framework import generics, status
from rest_framework.response import Response
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import CustomUser, UserConfirmation
from accounts.serializers import ( 
    RegisterSerializer,
    RegisterVerifySerializer,
    ResendCodeSerializer,
    LoginSerializer,
    LogoutSerializer,
    PasswordResetRequestSerializer,
    PasswordResetVerifySerializer,
    PasswordResetSerializer
) 
# Create your views here.
class RegisterApiView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            result = serializer.save()
            return Response(result, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterVerifyApiView(generics.GenericAPIView):
    serializer_class = RegisterVerifySerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.data['phone_number']
            code = serializer.data['code']
            user = CustomUser.objects.filter(phone_number=phone_number, is_active=False).first()
            otp_code = UserConfirmation.objects.filter(code=code).first()
            if user is None:
                return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
            if otp_code is None:
                return Response({'message': 'Code is invalid'}, status=status.HTTP_400_BAD_REQUEST)
            if otp_code.is_used != False or otp_code.expires < timezone.now():
                return Response({'message': 'Code is expired or invalid'})
            otp_code.is_used = True
            user.is_active = True
            otp_code.save()
            user.save()
            return Response({'message': 'User verified'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendCodeApiView(generics.GenericAPIView):
    serializer_class = ResendCodeSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        phone_number = serializer.data['phone_number']
        user = CustomUser.objects.filter(phone_number=phone_number).first()
        if user is None:
            return Response({'message': 'User not found'})
        code = user.generate_verify_code()
        return Response({'code':code})
    
class LoginApiView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.data['phone_number']
            password = serializer.data['password']
            user = CustomUser.objects.filter(phone_number=phone_number, is_active=True).first()
            if user is None:
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                })
            return Response({'error': 'Invalid credentials'})
            if user is None:
                return Response({'message': 'User not found'})
        return Response(serializer.errors)

class LogoutApiView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            refresh_token = serializer.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully!'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetRequestApiView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.data['phone_number']
            user = CustomUser.objects.filter(phone_number=phone_number).first()
            if user is None:
                return Response({'message': 'User not found'})
            code = user.generate_verify_code()
            return Response({'message': 'Code is sent to your phone number', 'code':code})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PasswordResetVerifyApiView(generics.GenericAPIView):
    serializer_class = PasswordResetVerifySerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.data['phone_number']
            code = serializer.data['code']
            user = CustomUser.objects.filter(phone_number=phone_number).first()
            otp_code = UserConfirmation.objects.filter(code=code).first()
            if user is None:
                return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            if otp_code is None or otp_code.expires < timezone.now():
                return Response({'message': 'Incorrect verification code'}, status=status.HTTP_400_BAD_REQUEST)
            otp_code.save()
            return Response({'message': 'Verification code is correct. Now you can change your password'}, status=status.HTTP_200_OK)
        return Response(serializer.errors)
    
class PasswordResetApiView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.data['phone_number']
            new_password = serializer.data['new_password']
            confirm_password = serializer.data['confirm_password']
            user = CustomUser.objects.filter(phone_number=phone_number).first()
            otp_code = UserConfirmation.objects.filter(user=user, is_used=True).first()
            if user is None:
                return Response({'message': 'User not found'})
            if otp_code is None:
                return Response({'message': 'Verification code not confirmed'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(confirm_password)
            user.save()
            return Response({'message': 'Your password changed successfully'})
        return Response(serializer.errors)