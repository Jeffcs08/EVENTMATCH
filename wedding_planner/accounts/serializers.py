from rest_framework import serializers
from django.contrib.auth.models import User
from events.serializers import EventSerializer

class UserSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True, source='event_set')
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'last_login', 'is_active', 'events']