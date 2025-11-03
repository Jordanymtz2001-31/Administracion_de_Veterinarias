from rest_framework.routers import DefaultRouter
from .views import MascotasViewSet

router = DefaultRouter()

router.register('', MascotasViewSet, basename="mascotas")

urlpatterns = router.urls