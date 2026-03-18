from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events.views import EventViewSet
from guests.views import GuestViewSet
from suppliers.views import SupplierViewSet
from checklist.views import ChecklistViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'guests', GuestViewSet, basename='guest')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'checklist', ChecklistViewSet, basename='checklist')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('accounts.urls')),
    path('api/chat/', include('my_chat_app.urls')),
]