from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from events.models import Event
from guests.models import Guest
from suppliers.models import Supplier
from checklist.models import ChecklistItem
import openai
import os

# Configure sua chave da OpenAI
import os
openai_api_key = os.environ.get('OPENAI_API_KEY')

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
            
            # Construir o prompt
            prompt = f"""
            Você é uma assistente especialista em planejamento de casamentos.
            
            DADOS DO EVENTO:
            - Noivos: {event.couple_names}
            - Data: {event.event_date}
            - Local: {event.venue}
            - Convidados esperados: {event.guests_expected}
            - Orçamento: R$ {event.budget_total}
            
            CONVIDADOS:
            - Total cadastrados: {guests.count()}
            - Confirmados: {guests.filter(status='confirmado').count()}
            - Pendentes: {guests.filter(status='pendente').count()}
            
            FORNECEDORES:
            - Total: {suppliers.count()}
            - Contratados: {suppliers.filter(status='contratado').count()}
            - Gasto atual: R$ {sum(s.value for s in suppliers if s.value)}
            
            CHECKLIST:
            - Total de tarefas: {checklist.count()}
            - Concluídas: {checklist.filter(done=True).count()}
            
            Pergunta do usuário: {user_message}
            
            Responda em português, de forma prática e amigável.
            """
            
            # Chamar a OpenAI
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Você é uma consultora de casamentos profissional."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            reply = response.choices[0].message.content
            
            return Response({'reply': reply})
            
        except Event.DoesNotExist:
            return Response(
                {'error': 'Evento não encontrado'},
                status=404
            )
        except Exception as e:
            print(f"Erro: {str(e)}")
            return Response(
                {'error': f'Erro ao processar: {str(e)}'},
                status=500
            )