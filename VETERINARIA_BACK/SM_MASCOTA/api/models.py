from django.db import models

class Mascotas(models.Model):
    id_mascota = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    raza = models.CharField(max_length=30)
    edad = models.IntegerField()
    razon_cita = models.CharField(max_length=50)
    id_cliente = models.IntegerField()
    id_responsable = models.IntegerField()
    id_veterinaria = models.IntegerField()

    class Meta:
        db_table = "mascotas"

    def __str__(self):
        return f"{self.nombre} - {self.raza}"
