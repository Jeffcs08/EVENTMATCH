from django.contrib import admin
from .models import Guest

class GuestAdmin(admin.ModelAdmin):
    list_display = ('name', 'event', 'status', 'group_name', 'table_name', 'phone')
    list_filter = ('status', 'group_name', 'created_at')
    search_fields = ('name', 'group_name', 'phone', 'dietary')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Informações do Convidado', {
            'fields': ('event', 'name', 'group_name', 'status')
        }),
        ('Detalhes', {
            'fields': ('table_name', 'phone', 'dietary')
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['confirmar_convidados', 'marcar_como_pendente', 'recusar_convidados']
    
    def confirmar_convidados(self, request, queryset):
        queryset.update(status='confirmado')
        self.message_user(request, f'{queryset.count()} convidado(s) confirmado(s).')
    confirmar_convidados.short_description = "Confirmar convidados selecionados"
    
    def marcar_como_pendente(self, request, queryset):
        queryset.update(status='pendente')
        self.message_user(request, f'{queryset.count()} convidado(s) marcado(s) como pendente.')
    marcar_como_pendente.short_description = "Marcar como pendente"
    
    def recusar_convidados(self, request, queryset):
        queryset.update(status='recusado')
        self.message_user(request, f'{queryset.count()} convidado(s) recusado(s).')
    recusar_convidados.short_description = "Recusar convidados selecionados"

admin.site.register(Guest, GuestAdmin)