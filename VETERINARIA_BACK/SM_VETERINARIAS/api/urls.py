from rest_framework.routers import DefaultRouter
from .views import GuardarClientesView, GuardarMascotasView, GuardarResponsableView, ListarClientesView, ListarMascotasView, ListarResponsablesView, DetalleVeterinariaView, VeterinariasViewSet
from django.urls import path, include


router = DefaultRouter()
router.register('', VeterinariasViewSet, basename='responsables')

urlpatterns = [
    path('', include(router.urls)),
    path('listar-clientes', ListarClientesView.as_view(), name='listarC'),
    path('listar-mascotas', ListarMascotasView.as_view(), name='listarM'),
    path('listar-responsables', ListarResponsablesView.as_view(), name='guardarR'),
    path('guardar-cliente', GuardarClientesView.as_view(), name='guardarC'),
    path('guardar-mascotas', GuardarMascotasView.as_view(), name='guardarM'),
    path('guardar-responsable', GuardarResponsableView.as_view(), name='guardarR'),
    path('detalle-veterinaria/<int:id_veterinaria>/', DetalleVeterinariaView.as_view(), name='detalleVeterinaria')

]