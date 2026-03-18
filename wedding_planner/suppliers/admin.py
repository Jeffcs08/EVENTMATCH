from django.contrib import admin
from .models import Supplier

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'event', 'status', 'value')
    search_fields = ('name', 'category', 'contact')
    list_filter = ('status', 'category')