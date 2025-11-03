from rest_framework import viewsets
from .models import Responsables
from .serializer import ResponsablesSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import requests


class ResponsablesViewSet(viewsets.ModelViewSet):
    queryset = Responsables.objects.all()
    serializer_class = ResponsablesSerializer

    # Metodo personalizado para obtener responsables por veterinaria
    @action(detail=False, methods=['get'])
    def responsables_por_veterinaria(self, request):
        # Buscamos el parametro id_veterinaria en la URL
        id_veterinaria = request.query_params.get('id_veterinaria')

        # Validamos
        if id_veterinaria:
            responsables = Responsables.objects.filter(id_veterinaria=id_veterinaria)
            serializer = self.get_serializer(responsables, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Falta el parametro id_veterinaria"}, status=400)

# API para detalles de que responsable esta acargo de x mascota
class DetalleResponsableView(APIView):
    def get(self, request, *args, **kwargs):
        # Extraer id_responsable de kwargs (pasado por Django desde la URL)
        id_responsable = kwargs.get('id_responsable')
        try:
            # Buscar el responsable por su ID
            responsable = Responsables.objects.get(id_responsable=id_responsable)

            # Usar nombre del contenedor en lugar de IP fija (más estable)
            url_mascotas = f'http://172.22.0.5:8002/mascotas/mascotas_por_responsable/?id_responsable={id_responsable}'

            # Inicializar variables para manejo resiliente
            mascotas = []
            mascotas_error = None
            
            try:
                # Realizamos la petición al microservicio de mascotas
                response_mascotas = requests.get(url_mascotas, timeout=10)
                
                # Debug: Verificar los status codes
                print(f"Status mascotas: {response_mascotas.status_code}")
                print(f"URL mascotas: {url_mascotas}")
                
                if response_mascotas.status_code == 200:
                    # Recuperamos y almacenamos los cuerpos de las respuestas en formato JSON
                    mascotas = response_mascotas.json()
                else:
                    # Capturar error del microservicio pero continuar
                    try:
                        mascotas_error = response_mascotas.json()
                    except:
                        mascotas_error = response_mascotas.text
                        
            except requests.RequestException as e:
                # Capturar error de conexión pero continuar con datos del responsable
                print(f"Error conectando a MS-MASCOTAS: {e}")
                mascotas_error = str(e)
            
            # Siempre devolver información del responsable (con o sin mascotas)
            detalle_responsable = {
                'responsable': {
                    'id_responsable': responsable.id_responsable,
                    'nombre': responsable.nombre,
                    'contacto': responsable.contacto,
                },
                'mascotas': mascotas if mascotas else 'Esta Persona encargada no tiene Mascotas a cargo'
            }
            
            # Incluir información del error si hubo problemas con mascotas
            if mascotas_error:
                detalle_responsable['mascotas_error'] = mascotas_error
            
            return Response(detalle_responsable, status=status.HTTP_200_OK)
            
        except Responsables.DoesNotExist:
            return Response({"Error": "El responsable no existe"}, status=status.HTTP_404_NOT_FOUND)   