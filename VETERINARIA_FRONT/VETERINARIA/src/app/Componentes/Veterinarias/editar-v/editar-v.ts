import { Component, OnInit } from '@angular/core';
import { Servidor } from '../../../Servidor/servidor';
import { Router, ActivatedRoute } from '@angular/router';
import { Veterinaria } from '../../../Entidad/veterinaria';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-v',
  imports: [FormsModule],
  templateUrl: './editar-v.html',
  styleUrl: './editar-v.css',
})
export class EditarV implements OnInit {

  // Creamos el constructor que inyecta el servicio Servidor
  constructor(private servicio: Servidor, private router: Router, private route: ActivatedRoute) { }

  // Creamos la instancia de la entidad veterinaria
  veterinaria: Veterinaria = new Veterinaria();
  loading = true;
  error = '';

  ngOnInit(): void {
    // Obtenemos el ID de la veterinaria desde la ruta
    this.route.params.subscribe(params => {
      const id = +params['id']; // El + convierte string a number
      if (id) {
        this.cargarVeterinaria(id);
      } else {
        this.error = 'ID de veterinaria no válido';
        this.loading = false;
      }
    });
  }

  cargarVeterinaria(id: number): void {
    this.servicio.buscarVeterinaria(id).subscribe({
      next: (data: any) => {
        this.veterinaria = Array.isArray(data) ? data[0] : data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la veterinaria:', err);
        this.error = 'Error al cargar los datos de la veterinaria';
        this.loading = false;
      }
    });
  }

  editar() {
    this.servicio.editarVeterinaria(this.veterinaria.id_veterinaria, this.veterinaria).subscribe(() => {
      this.router.navigate(['listar-veterinarias']);
      },
    );
  }

  cancelar() {
    this.router.navigate(['listar-veterinarias']);
  }

}
