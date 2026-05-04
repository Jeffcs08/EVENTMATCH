from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class ProfileSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = ['id', 'phone', 'address', 'avatar', 'avatar_url', 'bio', 'birth_date']
        read_only_fields = ['id']
    
    def get_avatar_url(self, obj):
        if obj.avatar:
            return obj.avatar.url
        return None