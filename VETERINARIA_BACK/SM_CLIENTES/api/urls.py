from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, DetalleClienteView
from django.urls import include, path

router = DefaultRouter()
router.register('', ClienteViewSet, basename='clientes')

# Colocamos las rutas por defecto y las personalizadas
urlpatterns = [
    path('', include(router.urls)),
    path('detalle_cliente/<int:id_cliente>/', DetalleClienteView.as_view(), name='detalleCliente' )
]