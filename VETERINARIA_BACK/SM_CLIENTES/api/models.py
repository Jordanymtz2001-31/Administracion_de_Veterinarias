from django.db import models

class Clientes(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    direccion = models.CharField(max_length=55)
    contacto = models.CharField(max_length=50)
    id_veterinaria = models.IntegerField()

    class Meta:
        db_table = 'clientes'

    def __str__(self):
        return self.nombre
