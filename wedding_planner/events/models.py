from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    STYLE_CHOICES = [
        ('classico', 'Clássico'),
        ('rustico', 'Rústico'),
        ('moderno', 'Moderno'),
        ('luxo', 'Luxo'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    couple_names = models.CharField(max_length=255)
    event_date = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=100)
    venue = models.CharField(max_length=255)
    guests_expected = models.IntegerField(default=0)
    budget_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    style = models.CharField(max_length=20, choices=STYLE_CHOICES, default='classico')
    ceremony_time = models.TimeField(default='16:00')
    party_time = models.TimeField(default='18:00')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Casamento de {self.couple_names}"