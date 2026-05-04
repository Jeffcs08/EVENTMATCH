import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wedding_planner.settings')
django.setup()

from django.contrib.auth.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superusuário admin criado com sucesso!")
else:
    print("Superusuário já existe.")