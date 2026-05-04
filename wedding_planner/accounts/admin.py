from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Informações Pessoais'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Permissões'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Datas Importantes'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    
    actions = ['ativar_usuarios', 'desativar_usuarios', 'tornar_admin', 'remover_admin']
    
    def ativar_usuarios(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} usuário(s) ativado(s) com sucesso.')
    ativar_usuarios.short_description = "Ativar usuários selecionados"
    
    def desativar_usuarios(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} usuário(s) desativado(s) com sucesso.')
    desativar_usuarios.short_description = "Desativar usuários selecionados"
    
    def tornar_admin(self, request, queryset):
        queryset.update(is_staff=True, is_superuser=True)
        self.message_user(request, f'{queryset.count()} usuário(s) promovido(s) a administrador.')
    tornar_admin.short_description = "Tornar administrador"
    
    def remover_admin(self, request, queryset):
        queryset.update(is_staff=False, is_superuser=False)
        self.message_user(request, f'{queryset.count()} usuário(s) removido(s) do grupo de administradores.')
    remover_admin.short_description = "Remover privilégios de administrador"

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)