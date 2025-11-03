import { Component, OnInit } from '@angular/core';
import { Servidor } from '../../../Servidor/servidor';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Responsables } from '../../../Entidad/responsables';

@Component({
  selector: 'app-editar-r',
  imports: [FormsModule],
  templateUrl: './editar-r.html',
  styleUrl: './editar-r.css',
})
export class EditarR implements OnInit {

  // Creamos el constructor que inyecta el servicio Servidor
  constructor(private servicio: Servidor, private router: Router, private route: ActivatedRoute) { }

  // Creamos la instancia de la entidad responsable
  responsable: Responsables = new Responsables();
  loading = true;
  error = '';

  ngOnInit(): void {
    // Obtenemos el ID del responsable desde la ruta
    this.route.params.subscribe(params => {
      const id = +params['id']; // El + convierte string a number
      if (id) {
        this.cargarResponsable(id);
      } else {
        this.error = 'ID de responsable no válido';
        this.loading = false;
      }
    });
  }

  cargarResponsable(id: number): void {
    this.servicio.buscarResponsable(id).subscribe({
      next: (data: any) => {
        this.responsable = Array.isArray(data) ? data[0] : data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el responsable:', err);
        this.error = 'Error al cargar los datos del responsable';
        this.loading = false;
      }
    });
  }

  editar() {
    this.servicio.editarResponsable(this.responsable.id_responsable, this.responsable).subscribe(() => {
      this.router.navigate(['listar-responsables']);
      },
    );
  }

  cancelar() {
    this.router.navigate(['listar-responsables']);
  }

}
