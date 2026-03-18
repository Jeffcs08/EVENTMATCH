from rest_framework import serializers
from .models import ChecklistItem

class ChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChecklistItem
        fields = '__all__'
        read_only_fields = ['created_at']