from django.contrib import admin
from .models import Guest

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'status', 'group_name', 'table_name')
    search_fields = ('name', 'group_name')
    list_filter = ('status', 'group_name')