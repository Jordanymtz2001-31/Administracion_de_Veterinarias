import requests
from rest_framework import viewsets
from .models import Veterinarias
from .serializer import VeterinariasSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class VeterinariasViewSet(viewsets.ModelViewSet):
    queryset = Veterinarias.objects.all()
    serializer_class = VeterinariasSerializer

# API para detalles de que veterinaria de toda la informacion
class DetalleVeterinariaView(APIView):
    def get(self, request, id_veterinaria):
        try:
            # Buscar el la veterinaria por su ID
            veterinaria = Veterinarias.objects.get(id_veterinaria=id_veterinaria)

            #Ruta de acceso: personalizada de buscar cliente por ID de MS-MASCOTAS por variable
            url_mascotas = f'http://172.22.0.5:8002/mascotas/mascotas_por_veterinaria/?id_veterinaria={id_veterinaria}'
            url_cliente = f'http://172.22.0.8:8001/clientes/clientes_por_veterinaria/?id_veterinaria={id_veterinaria}'
            url_responsable = f'http://172.22.0.4:8003/responsable/responsables_por_veterinaria/?id_veterinaria={id_veterinaria}'

            try:

                #Realizamos las peticiones 
                response_mascotas = requests.get(url_mascotas, timeout=10)
                response_clientes = requests.get(url_cliente, timeout=10)
                response_responsable = requests.get(url_responsable, timeout=10)

                # Debug: Verificar los status codes
                print(f"Status mascotas: {response_mascotas.status_code}")
                print(f"URL productos: {url_mascotas}")
                print(f"Status cliente: {response_clientes.status_code}")
                print(f"URL cliente: {url_cliente}")
                print(f"Status responsable: {response_responsable.status_code}")
                print(f"URL responsable: {url_responsable}")

                # Verificamos los estatus
                if response_mascotas.status_code == 200 and response_clientes.status_code == 200 and response_responsable.status_code == 200: 
                    #Rescuperamos y almacenamos los cuerpos de las respuestas en formato JSON
                    mascotas = response_mascotas.json()
                    clientes = response_clientes.json()
                    responsables = response_responsable.json()


                    #Creamos un diccionario con los valores de mascotas y cliente
                    detalle_veterinaria = {
                        'veterinaria': {
                            'id_veterinaria' : veterinaria.id_veterinaria,
                            'nombre' : veterinaria.nombre,
                            'direccion' : veterinaria.direccion,
                            'telefono' : veterinaria.telefono
                        },
                        'mascotas' : mascotas if mascotas else 'Esta veterinaria no tiene Mascotas a cargo',
                        'cliente' : clientes if clientes else 'Esta veterinaria no tiene cliente',
                        'responsables' : responsables if responsables else 'Esta veterinaria no tiene responsables a cargo'

                    }
                    return Response(detalle_veterinaria, status=status.HTTP_200_OK)
                else:
                    # Retornar información más específica sobre el error
                    error_details = {
                        "Error": "Error al obtener el detalle de la veterinaria",
                        "detalles": {
                            "mascotas_status": response_mascotas.status_code,
                            "url_mascota": url_mascotas,
                            "cliente_status": response_clientes.status_code,
                            "url_cliente": url_cliente,
                            "responsable_status": response_responsable.status_code,
                            "url_responsable": url_responsable
                        }
                    }
                    if response_mascotas.status_code != 200:
                        try:
                            error_details["mascota_error"] = response_mascotas.json()
                        except:
                            error_details["mascota_error"] = response_mascotas.text

                    if response_clientes.status_code != 200:
                        try:
                            error_details["cliente_error"] = response_clientes.json()
                        except:
                            error_details["cliente_error"] = response_clientes.text

                    if response_responsable.status_code != 200:
                        try:
                            error_details["responsable_error"] = response_responsable.json()
                        except:
                            error_details["responsable_error"] = response_responsable.text
                            
                    return Response(error_details, status=status.HTTP_400_BAD_REQUEST)
                    
            except requests.RequestException as e:
                return Response({
                    "Error": "Error de conexión con los microservicios",
                    "detalle": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Veterinarias.DoesNotExist:
            return Response({"Error": "La Veterinaria no existe"}, status=status.HTTP_404_NOT_FOUND)   
# Vistas basadas en clases
class ListarMascotasView(APIView):
    def get(self, request):
        try:
            url = 'http://172.22.0.5:8002/mascotas/'

            #Realizamos una peticion al MS-MASCOTAS
            response = requests.get(url)
            
            # Validamos que el MS-MASCOTAS nos haya enviado un status 200
            if response.status_code == 200:
                #Retornamos el cuerpo de respuesta  en un formato JSON
                return Response(response.json(), status= status.HTTP_200_OK)
            else: # Si falla la respuesta
                return Response({"Error": "Error al obtener las lista de MASCOTAS desde MS-MASCOTAS"}, 
                                status=status.HTTP_400_BAD_REQUEST)
        # Si la conexion falla
        except requests.RequestException as e:
            return Response({"Error": f"Error de conexion: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Peticion de clientes
class ListarClientesView(APIView):
        def get(self, request):
            try:
                #Ruta de acceso al servicio retomo de MS-CLIENTE
                url = 'http://172.22.0.8:8001/clientes/'

                #Peticion  al servicio remoto
                response = requests.get(url)

                #Validamos ue el MS-CLIENTES nos haya enviado un status 200
                if response.status_code == 200:
                    #Retornamos el cuerpo de respuesta  en un formato JSON
                    return Response(response.json(), status= status.HTTP_200_OK)
                else: # Si falla la respuesta
                    return Response({"Error": "Error al obtener las lista de CLIENTES desde MS-CLIENTES"}, 
                                status=status.HTTP_400_BAD_REQUEST)
            # Si la conexion falla
            except requests.RequestException as e:
                return Response({"Error": f"Error de conexion: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
# Peticion pero sin validaciones
class ListarResponsablesView(APIView):
        def get(self, request):
            try:
                #Ruta de acceso al servicio retomo de MS-RESPONSABLES
                url = 'http://172.22.0.4:8003/responsable/'

                #Peticion  al servicio remoto
                response = requests.get(url)

                #Validamos ue el MS-RESPONSABLE nos haya enviado un status 200
                if response.status_code == 200:
                    #Retornamos el cuerpo de respuesta  en un formato JSON
                    return Response(response.json(), status= status.HTTP_200_OK)
                else: # Si falla la respuesta
                    return Response({"Error": "Error al obtener las lista de RESPONSABLES desde MS-RESPONSABLES"}, 
                                status=status.HTTP_400_BAD_REQUEST)
            # Si la conexion falla
            except requests.RequestException as e:
                return Response({"Error": f"Error de conexion: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GuardarClientesView(APIView):
        def post(self, request):
            try:
                #Ruta de acceso
                url = 'http://172.22.0.8:8001/clientes/'

                #Recuperamos y almacenamos  el cuerpo  de la peticion del cliente data
                data = request.data

                #Peticion al MS-PRODUCTOS con el cuerpo  de la peticion del cliente
                response = requests.post(url, json=data)

                if response.status_code == 201:
                    return Response (response.json(), status=status.HTTP_201_CREATED)
                # Si la respuesta no es un estatus 201 entonces me regresa la respuesta con el estatus
                return Response(response.json(), status=response.status_code)
            except requests.RequestException as e:
                return Response({"Error": f"Error de conexion: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            
class GuardarMascotasView(APIView):
    def post(self, request):
        try:
            #Ruta de acceso
            url = 'http://172.22.0.5:8002/mascotas/'

            #Recuperamos y almacenamos  el cuerpo  de la peticion del mascotas data
            data = request.data

            #Peticion al MS-MASCOTAS con el cuerpo  de la peticion del mascota
            response = requests.post(url, json=data)

            if response.status_code == 201:
                return Response (response.json(), status=status.HTTP_201_CREATED)
            # Si la respuesta no es un estatus 201 entonces me regresa la respuesta con el estatus
            return Response(response.json(), status=response.status_code)
        except requests.RequestException as e:
            return Response({"Error": f"Error de conexion: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GuardarResponsableView(APIView):
    def post(self, request):
        try:
            #Ruta de acceso
            url = 'http://172.22.0.4:8003/responsable/'

            #Recuperamos y almacenamos  el cuerpo  de la peticion del Responsable data
            data = request.data

            #Peticion al MS-RESPONSABLE con el cuerpo  de la peticion del cliente
            response = requests.post(url, json=data)

            if response.status_code == 201:
                return Response (response.json(), status=status.HTTP_201_CREATED)
            # Si la respuesta no es un estatus 201 entonces me regresa la respuesta con el estatus
            return Response(response.json(), status=response.status_code)
        except requests.RequestException as e:
            return Response({"Error": f"Error de conexion: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
