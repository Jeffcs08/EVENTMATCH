from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'event_type', 'theme', 'event_date', 'budget_total', 'user', 'created_at')
    list_filter = ('event_type', 'theme', 'event_date', 'created_at')
    search_fields = ('name', 'couple_names', 'company_name', 'city', 'venue')
    readonly_fields = ('created_at', 'updated_at', 'budget_spent')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('user', 'name', 'event_type', 'theme', 'custom_theme')
        }),
        ('Orçamento', {
            'fields': ('budget_total', 'budget_spent'),
            'classes': ('collapse',)
        }),
        ('Data e Local', {
            'fields': ('event_date', 'city', 'venue', 'start_time', 'end_time')
        }),
        ('Detalhes', {
            'fields': ('guests_expected', 'couple_names', 'company_name', 'notes')
        }),
        ('Datas do Sistema', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['duplicar_evento', 'exportar_selecionados']
    
    def duplicar_evento(self, request, queryset):
        for event in queryset:
            event.pk = None
            event.name = f"{event.name} (Cópia)"
            event.save()
        self.message_user(request, f'{queryset.count()} evento(s) duplicado(s).')
    duplicar_evento.short_description = "Duplicar eventos selecionados"
    
    def exportar_selecionados(self, request, queryset):
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="eventos_exportados.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Nome', 'Tipo', 'Tema', 'Data', 'Cidade', 'Local', 'Orçamento', 'Criado por'])
        
        for event in queryset:
            writer.writerow([
                event.id, event.name, event.get_event_type_display(),
                event.get_theme_display(), event.event_date, event.city,
                event.venue, event.budget_total, event.user.username
            ])
        
        return response
    exportar_selecionados.short_description = "Exportar eventos selecionados para CSV"

admin.site.register(Event, EventAdmin)