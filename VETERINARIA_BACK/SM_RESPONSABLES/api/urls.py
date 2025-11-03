from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ResponsablesViewSet, DetalleResponsableView

router = DefaultRouter()
router.register('', ResponsablesViewSet, basename="responsables")

# Colocamos las rutas por defecto y las personalizadas
urlpatterns = [
    path('', include(router.urls)),
    path('detalle_responsable/<int:id_responsable>/', DetalleResponsableView.as_view(), name='detalleResponsable' )
]