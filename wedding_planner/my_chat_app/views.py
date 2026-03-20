from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from events.models import Event
from guests.models import Guest
from suppliers.models import Supplier
from checklist.models import ChecklistItem
import openai
import os

class ChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        event_id = request.data.get('event_id')
        user_message = request.data.get('message', '')
        
        if not event_id or not user_message:
            return Response(
                {'error': 'event_id e message são obrigatórios'},
                status=400
            )
        
        try:
            # Buscar o evento
            event = Event.objects.get(id=event_id, user=request.user)
            
            # Buscar dados relacionados
            guests = Guest.objects.filter(event=event)
            suppliers = Supplier.objects.filter(event=event)
            checklist = ChecklistItem.objects.filter(event=event)
            
            # Calcular estatísticas
            total_guests = guests.count()
            confirmed_guests = guests.filter(status='confirmado').count()
            pending_guests = guests.filter(status='pendente').count()
            
            total_suppliers = suppliers.count()
            contracted_suppliers = suppliers.filter(status='contratado').count()
            total_spent = sum(s.value for s in suppliers if s.value)
            
            total_tasks = checklist.count()
            completed_tasks = checklist.filter(done=True).count()
            
            # Tentar usar OpenAI se a chave existir
            api_key = os.environ.get('OPENAI_API_KEY')
            
            if api_key:
                try:
                    client = openai.OpenAI(api_key=api_key)
                    prompt = f"""
                    Você é uma assistente de casamentos.
                    
                    Evento: {event.name or event.couple_names}
                    Convidados: {total_guests} total, {confirmed_guests} confirmados
                    Fornecedores: {total_suppliers} total, {contracted_suppliers} contratados
                    Gasto: R$ {total_spent}
                    
                    Pergunta: {user_message}
                    """
                    
                    response = client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=300
                    )
                    reply = response.choices[0].message.content
                except Exception as e:
                    reply = f"Erro na IA: {str(e)}"
            else:
                # Resposta sem IA (modo offline)
                reply = f"""
                📊 **Resumo do evento:** {event.name or event.couple_names}
                
                👥 Convidados: {total_guests} total, {confirmed_guests} confirmados, {pending_guests} pendentes
                📦 Fornecedores: {total_suppliers} total, {contracted_suppliers} contratados
                💰 Gasto: R$ {total_spent:.2f}
                ✅ Tarefas: {completed_tasks}/{total_tasks} concluídas
                
                💡 Para ativar o chat com IA, adicione a chave OPENAI_API_KEY no Render!
                """
            
            return Response({'reply': reply})
            
        except Event.DoesNotExist:
            return Response({'error': 'Evento não encontrado'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)