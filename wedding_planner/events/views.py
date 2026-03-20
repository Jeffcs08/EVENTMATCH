from rest_framework import viewsets, permissions
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Usuário comum vê apenas seus eventos
        user = self.request.user
        if user.is_superuser:
            # Admin vê todos os eventos
            return Event.objects.all().order_by('-created_at')
        # Usuário comum vê apenas seus eventos
        return Event.objects.filter(user=user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)