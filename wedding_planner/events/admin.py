from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('couple_names', 'event_date', 'city', 'venue', 'user')
    search_fields = ('couple_names', 'city', 'venue')
    list_filter = ('style', 'event_date')