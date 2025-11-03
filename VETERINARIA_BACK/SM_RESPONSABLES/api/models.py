from django.db import models

class Responsables(models.Model):
    id_responsable = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    contacto = models.CharField(max_length=50)
    id_veterinaria = models.IntegerField()

    class meta:
        db_table = 'responsables'

    def __str__(self):
        return f"{Responsables.nombre}"
