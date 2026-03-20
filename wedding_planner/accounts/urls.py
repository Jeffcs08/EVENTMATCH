from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),  # <-- rota register
    path('admin/users/', views.admin_users_view, name='admin_users'),
    path('admin/events/', views.admin_all_events_view, name='admin_all_events'),
    path('admin/event/<int:event_id>/', views.admin_manage_event_view, name='admin_manage_event'),
]