import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../../Servidor/servidor';
import { Router, ActivatedRoute } from '@angular/router';
import { Mascotas } from '../../../Entidad/mascotas';

@Component({
  selector: 'app-editar-m',
  imports: [FormsModule],
  templateUrl: './editar-m.html',
  styleUrl: './editar-m.css',
})
export class EditarM implements OnInit {

  // Creamos el constructor que inyecta el servicio Servidor
  constructor(private servicio: Servidor, private router: Router, private route: ActivatedRoute) { }

  // Creamos la instancia de la entidad mascota
  mascota: Mascotas = new Mascotas();
  loading = true;
  error = '';

  ngOnInit(): void {
    // Obtenemos el ID de la mascota desde la ruta
    this.route.params.subscribe(params => {
      const id = +params['id']; // El + convierte string a number
      if (id) {
        this.cargarMascota(id);
      } else {
        this.error = 'ID de mascota no válido';
        this.loading = false;
      }
    });
  }

  cargarMascota(id: number): void {
    this.servicio.buscarMascota(id).subscribe({
      next: (data: any) => {
        this.mascota = Array.isArray(data) ? data[0] : data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la mascota:', err);
        this.error = 'Error al cargar los datos de la mascota';
        this.loading = false;
      }
    });
  }

  editar() {
    this.servicio.editarMascota(this.mascota.id_mascota, this.mascota).subscribe(() => {
      this.router.navigate(['listar-mascotas']);
      },
    );
  }

  cancelar() {
    this.router.navigate(['listar-mascotas']);
  }

}
