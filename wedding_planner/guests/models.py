from django.db import models
from events.models import Event

class Guest(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('confirmado', 'Confirmado'),
        ('recusado', 'Recusado'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    group_name = models.CharField(max_length=100, default='Geral')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    table_name = models.CharField(max_length=50, blank=True)
    dietary = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name