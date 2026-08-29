from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
from .models import User, VendorProfile


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    isVerified = serializers.BooleanField(source='is_email_verified', read_only=True)
    avatar = serializers.ImageField(source='profile_picture', read_only=True)
    vendorProfileId = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'avatar', 'role', 'permissions',
                  'createdAt', 'isVerified', 'vendorProfileId')

    def get_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip() or obj.email

    def get_role(self, obj):
        return 'client' if obj.user_type == 'customer' else obj.user_type
    
    def get_vendorProfileId(self, obj):
        if hasattr(obj, 'vendor_profile') and obj.vendor_profile:
            return obj.vendor_profile.id
        return None


class VendorProfileSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk', read_only=True)
    name = serializers.SerializerMethodField()
    shopName = serializers.CharField(source='store_name')
    description = serializers.CharField(source='store_description', allow_blank=True, required=False)
    logo = serializers.ImageField(source='store_logo', read_only=True)
    rating = serializers.DecimalField(max_digits=2, decimal_places=1, read_only=True)
    approvalStatus = serializers.CharField(source='approval_status', read_only=True)
    rejectionReason = serializers.CharField(source='rejection_reason', read_only=True)
    isVerified = serializers.BooleanField(source='user.is_email_verified', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = VendorProfile
        fields = ('id', 'name', 'shopName', 'email', 'description', 'logo', 'rating',
                  'approvalStatus', 'rejectionReason', 'isVerified', 'createdAt')
        read_only_fields = ('createdAt',)

    def get_name(self, obj):
        return f'{obj.user.first_name} {obj.user.last_name}'.strip() or obj.store_name


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=('client',), default='client')
    permissions = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    def create(self, data):
        name = data.pop('name', '')
        first, _, last = name.partition(' ')
        role = data.pop('role', 'client')
        data['user_type'] = 'customer' if role == 'client' else role
        data['first_name'], data['last_name'] = first, last
        user = User.objects.create_user(**data)
        if user.user_type == 'vendor':
            VendorProfile.objects.create(user=user, store_name=f"{user.first_name}'s Store")
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(request=self.context.get('request'), email=attrs['email'],
                           password=attrs['password'])
        if not user or not user.is_active:
            raise serializers.ValidationError({'message': 'Unable to log in with provided credentials.'})
        attrs['user'] = user
        return attrs
