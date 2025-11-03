from rest_framework import viewsets
from .models import Clientes
from .serializer import ClienteSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import requests


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Clientes.objects.all()
    serializer_class = ClienteSerializer

    #Metodo personalizado para obtener clientes por veterinaria
    @action(detail=False, methods=['get'])
    def clientes_por_veterinaria(self, request):
        #Buscamos el parametro id_veterinaria en la URL
        id_veterinaria = request.query_params.get('id_veterinaria')
        # Validamos 
        if id_veterinaria:
            clientes = Clientes.objects.filter(id_veterinaria=id_veterinaria)
            serializer = self.get_serializer(clientes, many=True)
            return Response(serializer.data) #Retornamos la respuesta
        else:
            return Response({"error": "Falta el parametro id_veterinaria"}, status=400)

# Vista Basada en clase con APIView, es decir no es un ViewSet
class DetalleClienteView(APIView):
    def get(self, request, id_cliente):
        try:
            # Buscar el cliente por su ID
            cliente = Clientes.objects.get(id_cliente=id_cliente)

            #Ruta de acceso: personalizada de buscar cliente por ID de MS-MASCOTAS por variable
            url_mascotas = f'http://172.22.0.5:8002/mascotas/mascotas_por_cliente/?id_cliente={id_cliente}'

            try:

                #Realizamos las peticiones 
                response_mascotas = requests.get(url_mascotas, timeout=10)

                # Debug: Verificar los status codes
                print(f"Status mascotas: {response_mascotas.status_code}")
                print(f"URL productos: {url_mascotas}")

                # Verificamos los estatus
                if response_mascotas.status_code == 200:
                    #Rescuperamos y almacenamos los cuerpos de las respuestas en formato JSON
                    mascotas = response_mascotas.json()

                    #Creamos un diccionario con los valores de mascotas y cliente
                    detalle_cliente = {
                        'cliente': {
                            'id_cliente' : cliente.id_cliente,
                            'nombre' : cliente.nombre,
                            'direccion' : cliente.direccion,
                            'contacto' : cliente.contacto,
                        },
                        'mascotas' : mascotas if mascotas else 'Esta Persona no tiene Mascotas'
                    }
                    return Response(detalle_cliente, status=status.HTTP_200_OK)
                else:
                    # Retornar información más específica sobre el error
                    error_details = {
                        "Error": "Error al obtener el detalle de la cliente",
                        "detalles": {
                            "mascotas_status": response_mascotas.status_code,
                            "url_mascota": url_mascotas
                        }
                    }
                    if response_mascotas.status_code != 200:
                        try:
                            error_details["mascota_error"] = response_mascotas.json()
                        except:
                            error_details["mascota_error"] = response_mascotas.text
                            
                    return Response(error_details, status=status.HTTP_400_BAD_REQUEST)
                    
            except requests.RequestException as e:
                return Response({
                    "Error": "Error de conexión con los microservicios",
                    "detalle": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Clientes.DoesNotExist:
            return Response({"Error": "El cliente no existe"}, status=status.HTTP_404_NOT_FOUND)   
