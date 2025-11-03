from rest_framework import viewsets
from .models import Mascotas
from .serializer import MascotasSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


class MascotasViewSet(viewsets.ModelViewSet):
    queryset = Mascotas.objects.all()
    serializer_class = MascotasSerializer

    #Metodo personalizado para obtener mascotas por cliente mediante query params
    @action(detail=False, methods=['get'])
    def mascotas_por_cliente(self, request):
        #Buscamos el parametro id_cliente en la URL
        id_cliente = request.query_params.get('id_cliente')

        #Validamos
        if id_cliente:

            mascotas = Mascotas.objects.filter(id_cliente=id_cliente)
            serializer = self.get_serializer(mascotas, many=True)
            # Retornamos la respuesta
            return Response(serializer.data)
        else:
            return Response({"error": "Falta el parametro id_cliente"}, status=400)
    
    #Metodo personalizado para obtener mascotas por veterinaria
    @action(detail=False, methods=['get'])
    def mascotas_por_veterinaria(self, request):
        # Buscamos las mascotas por veterinaria
        id_veterinaria = request.query_params.get('id_veterinaria')

        # Validamos 
        if id_veterinaria:
            mascotas = Mascotas.objects.filter(id_veterinaria=id_veterinaria)
            serializer = self.get_serializer(mascotas, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Falta el parametro id_veterinaria"}, status=400)
    
    #Metodo personalizado para obtener por resposable
    @action(detail=False, methods=['get'])
    def mascotas_por_responsable(self, request):
        # Buscamos las mascotas por responsable
        id_responsable = request.query_params.get('id_responsable')

        # Validamos
        if id_responsable:
            mascotas = Mascotas.objects.filter(id_responsable=id_responsable)
            serializer = self.get_serializer(mascotas, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Falta el parametro id_responsable"}, status=400)

