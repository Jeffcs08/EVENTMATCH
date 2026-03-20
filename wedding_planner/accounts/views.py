from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from events.models import Event
from events.serializers import EventSerializer
from .serializers import UserSerializer
import re


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    password2 = request.data.get('password2')
    phone = request.data.get('phone', '')
    
    # Validações
    if not username or not email or not password:
        return Response(
            {'error': 'Preencha todos os campos obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validar email
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return Response(
            {'error': 'Digite um email válido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validar senha
    if password != password2:
        return Response(
            {'error': 'As senhas não coincidem'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(password) < 6:
        return Response(
            {'error': 'A senha deve ter pelo menos 6 caracteres'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar se usuário já existe
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Este nome de usuário já está em uso'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Este email já está cadastrado'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Criar usuário
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    
    # Gerar token
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'Cadastro realizado com sucesso!',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': phone
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Preencha usuário e senha'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    from django.contrib.auth import authenticate
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    else:
        return Response(
            {'error': 'Usuário ou senha inválidos'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_view(request):
    # Verificar se o usuário é admin
    if not request.user.is_superuser:
        return Response(
            {'error': 'Acesso negado. Apenas administradores.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    users = User.objects.all().exclude(is_superuser=True)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_all_events_view(request):
    # Verificar se o usuário é admin
    if not request.user.is_superuser:
        return Response(
            {'error': 'Acesso negado. Apenas administradores.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    events = Event.objects.all().order_by('-created_at')
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def admin_manage_event_view(request, event_id):
    # Verificar se o usuário é admin
    if not request.user.is_superuser:
        return Response(
            {'error': 'Acesso negado. Apenas administradores.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response(
            {'error': 'Evento não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        event.delete()
        return Response({'message': 'Evento excluído com sucesso'})