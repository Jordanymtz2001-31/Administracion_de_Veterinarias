import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MS_VETERINARIA');

  //Creamos el constructor y le inyectamos el servicio de rutas
  constructor(private router: Router) {}

 // Listas
  listarClientes() {
    this.router.navigate(['listar-clientes']);
  }
  listarMascotas() {
    this.router.navigate(['listar-mascotas']);
  }
  listarResponsables() {
    this.router.navigate(['listar-responsables']);
  }
  listarVeterinarias() {
    this.router.navigate(['listar-veterinarias']);
  }


  // Nuevos
  nuevoCliente() {
    this.router.navigate(['guardar-cliente']);
  }
  nuevoMascota() {
    this.router.navigate(['guardar-mascota']);
  }
  nuevoResponsable() {
    this.router.navigate(['guardar-responsable']);
  }
  nuevoVeterinaria() {
    this.router.navigate(['guardar-veterinaria']);
  }

  //Editar
  editarCliente() {
    this.router.navigate(['editar-cliente']);
  }
  editarMascota() {
    this.router.navigate(['editar-mascota']);
  }
  editarResponsable() {
    this.router.navigate(['editar-responsable']);
  }
  editarVeterinaria() {
    this.router.navigate(['editar-veterinaria']);
  }
  

  // Detalles

  detalleCliente() {
    this.router.navigate(['detalles-cliente']);
  }
  detalleResponsable() {
    this.router.navigate(['detalles-responsable']);
  }
  detalleVeterinaria() {
    this.router.navigate(['detalles-veterinaria']);
  }
}
