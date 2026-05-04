from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    remaining_budget = serializers.ReadOnlyField()
    budget_percentage = serializers.ReadOnlyField()
    event_type_display = serializers.ReadOnlyField(source='get_event_type_display')
    theme_display = serializers.ReadOnlyField(source='get_theme_display')
    
    class Meta:
        model = Event
        fields = [
            'id', 'user', 'name', 'event_type', 'theme', 'custom_theme',
            'budget_total', 'budget_spent', 'event_date', 'city', 'venue',
            'guests_expected', 'couple_names', 'company_name',
            'start_time', 'end_time', 'notes',
            'remaining_budget', 'budget_percentage',
            'event_type_display', 'theme_display',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'budget_spent']
    
    def validate_budget_total(self, value):
        if value < 0:
            raise serializers.ValidationError("Orçamento não pode ser negativo")
        return value
        from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    remaining_budget = serializers.ReadOnlyField()
    budget_percentage = serializers.ReadOnlyField()
    event_type_display = serializers.ReadOnlyField(source='get_event_type_display')
    theme_display = serializers.ReadOnlyField(source='get_theme_display')
    
    class Meta:
        model = Event
        fields = [
            'id', 'user', 'name', 'event_type', 'theme', 'custom_theme',
            'budget_total', 'budget_spent', 'event_date', 'city', 'venue',
            'guests_expected', 'couple_names', 'company_name',
            'start_time', 'end_time', 'notes',
            'remaining_budget', 'budget_percentage',
            'event_type_display', 'theme_display',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at', 'budget_spent']
    
    def create(self, validated_data):
        # Garantir que budget_spent começa com 0
        validated_data['budget_spent'] = 0
        return super().create(validated_data)