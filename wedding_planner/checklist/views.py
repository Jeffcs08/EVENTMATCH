from rest_framework import viewsets, permissions
from .models import ChecklistItem
from .serializers import ChecklistSerializer

class ChecklistViewSet(viewsets.ModelViewSet):
    serializer_class = ChecklistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ChecklistItem.objects.filter(event__user=self.request.user)