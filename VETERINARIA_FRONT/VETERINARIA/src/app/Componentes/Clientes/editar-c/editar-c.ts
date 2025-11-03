import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../../Servidor/servidor';
import { Router, ActivatedRoute } from '@angular/router';
import { Clientes } from '../../../Entidad/clientes';

@Component({
  selector: 'app-editar-c',
  imports: [FormsModule],
  templateUrl: './editar-c.html',
  styleUrl: './editar-c.css',
})
export class EditarC implements OnInit {

  // Creamos el constructor que inyecta el servicio Servidor
  constructor(private servicio: Servidor, private router: Router, private route: ActivatedRoute) { }

  // Creamos la instancia de la entidad Clientes
  cliente: Clientes = new Clientes();
  loading = true;
  error = '';


  ngOnInit(): void {
    // Obtenemos el ID del cliente desde la ruta
    this.route.params.subscribe(params => {
      const id = +params['id']; // El + convierte string a number
      if (id) {
        this.cargarCliente(id);
      } else {
        this.error = 'ID de cliente no válido';
        this.loading = false;
      }
    });
  }

  cargarCliente(id: number): void {
    this.servicio.buscarCliente(id).subscribe({
      next: (data: any) => {
        this.cliente = Array.isArray(data) ? data[0] : data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el cliente:', err);
        this.error = 'Error al cargar los datos del cliente';
        this.loading = false;
      }
    });
  }

  editar() {
    this.servicio.editarCliente(this.cliente.id_cliente, this.cliente).subscribe(() => {
      this.router.navigate(['listar-clientes']);
      },
    );
  }

  cancelar() {
    this.router.navigate(['listar-clientes']);
  }

}
