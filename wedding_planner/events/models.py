from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    EVENT_TYPES = [
        ('wedding', 'Casamento'),
        ('corporate', 'Corporativo'),
        ('birthday', 'Aniversário'),
        ('party', 'Festa'),
        ('other', 'Outro'),
    ]
    
    THEMES = [
        ('classic', 'Clássico'),
        ('modern', 'Moderno'),
        ('rustic', 'Rústico'),
        ('beach', 'Praia'),
        ('garden', 'Jardim'),
        ('tech', 'Tecnologia'),
        ('hawaiian', 'Havaiano'),
        ('vintage', 'Vintage'),
        ('minimalist', 'Minimalista'),
        ('luxury', 'Luxo'),
        ('custom', 'Personalizado'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    
    # Informações básicas
    name = models.CharField(max_length=255, default='Meu Evento')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='wedding')
    theme = models.CharField(max_length=50, choices=THEMES, default='classic')
    custom_theme = models.CharField(max_length=255, blank=True, help_text='Se tema for personalizado, descreva aqui')
    
    # Orçamento
    budget_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    budget_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Data e local
    event_date = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True)
    venue = models.CharField(max_length=255, blank=True)
    
    # Detalhes do evento
    guests_expected = models.IntegerField(default=0)
    couple_names = models.CharField(max_length=255, blank=True, help_text='Para casamentos')
    company_name = models.CharField(max_length=255, blank=True, help_text='Para eventos corporativos')
    
    # Horários
    start_time = models.TimeField(default='18:00')
    end_time = models.TimeField(default='00:00')
    
    # Observações
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.event_type == 'wedding' and self.couple_names:
            return f"Casamento: {self.couple_names}"
        return f"{self.get_event_type_display()}: {self.name}"
    
    def remaining_budget(self):
        return self.budget_total - self.budget_spent
    
    def budget_percentage(self):
        if self.budget_total > 0:
            return (self.budget_spent / self.budget_total) * 100
        return 0