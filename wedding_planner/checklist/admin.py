from django.contrib import admin
from .models import ChecklistItem

@admin.register(ChecklistItem)
class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('task', 'event', 'phase', 'priority', 'done')
    search_fields = ('task', 'phase')
    list_filter = ('priority', 'done', 'phase')