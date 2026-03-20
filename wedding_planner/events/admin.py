from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'event_type', 'theme', 'event_date', 'budget_total', 'user')
    search_fields = ('name', 'city', 'venue')
    list_filter = ('event_type', 'theme')