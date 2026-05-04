from django.contrib import admin
from .models import Supplier

class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'event', 'status', 'value', 'score', 'contact')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('name', 'category', 'contact')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Informações do Fornecedor', {
            'fields': ('event', 'name', 'category', 'status')
        }),
        ('Financeiro', {
            'fields': ('value', 'score')
        }),
        ('Contato', {
            'fields': ('contact',)
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['marcar_como_contratado', 'marcar_como_negociacao', 'marcar_como_cotado']
    
    def marcar_como_contratado(self, request, queryset):
        queryset.update(status='contratado')
        self.message_user(request, f'{queryset.count()} fornecedor(es) marcado(s) como contratado.')
    marcar_como_contratado.short_description = "Marcar como contratado"
    
    def marcar_como_negociacao(self, request, queryset):
        queryset.update(status='negociacao')
        self.message_user(request, f'{queryset.count()} fornecedor(es) marcado(s) como em negociação.')
    marcar_como_negociacao.short_description = "Marcar como em negociação"
    
    def marcar_como_cotado(self, request, queryset):
        queryset.update(status='cotado')
        self.message_user(request, f'{queryset.count()} fornecedor(es) marcado(s) como cotado.')
    marcar_como_cotado.short_description = "Marcar como cotado"

admin.site.register(Supplier, SupplierAdmin)