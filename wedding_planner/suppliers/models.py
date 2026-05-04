# events/models.py
from django.db import models
from django.db import models
from events.models import Event

class Supplier(models.Model):
    STATUS_CHOICES = [
        ('cotado', 'Cotado'),
        ('negociacao', 'Negociação'),
        ('contratado', 'Contratado'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='cotado')
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    contact = models.CharField(max_length=255, blank=True)
    score = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name