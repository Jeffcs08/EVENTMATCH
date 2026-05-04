from django.contrib import admin
from .models import ChecklistItem

class ChecklistItemAdmin(admin.ModelAdmin):
    list_display = ('task', 'event', 'phase', 'priority', 'done', 'created_at')
    list_filter = ('priority', 'done', 'phase', 'created_at')
    search_fields = ('task', 'phase')
    readonly_fields = ('created_at',)
    ordering = ('-priority', '-created_at')
    
    fieldsets = (
        ('Tarefa', {
            'fields': ('event', 'task', 'phase', 'priority')
        }),
        ('Status', {
            'fields': ('done',)
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['marcar_como_concluida', 'marcar_como_pendente']
    
    def marcar_como_concluida(self, request, queryset):
        queryset.update(done=True)
        self.message_user(request, f'{queryset.count()} tarefa(s) marcada(s) como concluída.')
    marcar_como_concluida.short_description = "Marcar como concluída"
    
    def marcar_como_pendente(self, request, queryset):
        queryset.update(done=False)
        self.message_user(request, f'{queryset.count()} tarefa(s) marcada(s) como pendente.')
    marcar_como_pendente.short_description = "Marcar como pendente"

admin.site.register(ChecklistItem, ChecklistItemAdmin)