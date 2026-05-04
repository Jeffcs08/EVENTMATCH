from django.db import models
from events.models import Event

class ChecklistItem(models.Model):
    PRIORITY_CHOICES = [
        ('alta', 'Alta'),
        ('media', 'Média'),
        ('baixa', 'Baixa'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    phase = models.CharField(max_length=100, default='Planejamento')
    task = models.CharField(max_length=255)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='media')
    done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.task