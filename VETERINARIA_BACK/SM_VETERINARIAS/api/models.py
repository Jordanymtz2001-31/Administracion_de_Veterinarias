from django.db import models

class Veterinarias(models.Model):
    id_veterinaria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    telefono = models.CharField(max_length=15)

    class Meta:
        db_table = 'veterinarias'

    def __str__(self):
        return self.nombre
