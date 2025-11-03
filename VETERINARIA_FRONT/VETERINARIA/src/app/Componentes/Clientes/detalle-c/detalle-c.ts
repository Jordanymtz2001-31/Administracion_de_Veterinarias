import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../../Servidor/servidor';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-c',
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-c.html',
  styleUrl: './detalle-c.css',
})
export class DetalleC implements OnInit, AfterViewInit {

  constructor(private servidor: Servidor, private router: Router, private route: ActivatedRoute) {}

  detalleCliente: any = null;
  loading = false;
  error = '';
  mostrarBuscador = true;
  nombreBusqueda = '';         
  clientes: any[] = [];    
  clientesFiltrados: any[] = []; // Corregido el nombre
  clientesSeleccionado: any = null; // Corregido el nombre
  mostrarSugerencias = false;

  // El metodo ngAfterViewInit se ejecuta despues de que la vista se ha inicializado
  ngAfterViewInit(): void {
    setTimeout (() => {
      const section = document.getElementById('detalle-tienda-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  ngOnInit(): void {
    this.obtenerIdCliente();
  }

  obtenerIdCliente() {
    // Ya no necesitamos obtener el ID de la URL, siempre mostramos el buscador
    this.mostrarBuscador = true;
    this.loading = false;
    // Cargar la lista de responsables para el buscador
    this.cargarCliente();
  }

  cargarDetalleCliente(id: number) {
    console.log('Buscando detalle del cliente con ID:', id);
    this.loading = true;
    this.error = '';
    this.servidor.detalleCliente(id).subscribe({
      next: (data: any) => {
        console.log('Cliente encontrado:', data.cliente.nombre);
        console.log('Mascotas:', Array.isArray(data.mascotas) ? `${data.mascotas.length} mascotas` : data.mascotas);
        this.detalleCliente = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el detalle de cliente:', err);
        this.error = err.error?.Error || 'Error al cargar el detalle de cliente.';
        this.loading = false;
      }
    });
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }

  obtenerCantidadMascotas(): number {
    if (!this.detalleCliente || !this.detalleCliente.mascotas) {
      return 0;
    }
    return Array.isArray(this.detalleCliente.mascotas) ? this.detalleCliente.mascotas.length : 0;
  }

  volverAlistar() {
    this.router.navigate(['listar-clientes']);
  }

  volerInicio() {
    this.router.navigate(['/']).then(() => {
      const menu = document.getElementById('menu-section');
      menu?.scrollIntoView({ behavior: 'smooth', block: 'start'});
    });
  }

  // Método para cargar todas las veterinarias
  cargarCliente() {
    this.loading = true;
    this.servidor.listarClientes().subscribe({
      next: (data: any) => {
        this.clientes = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.error = 'Error al cargar la lista de clientes.';
        this.loading = false;
      }
    });
  }

  // Método para filtrar responsables mientras el usuario escribe
  filtrarClientes() {
    if (!this.nombreBusqueda.trim()) {
      this.clientesFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.clientesFiltrados = this.clientes.filter(responsable => 
      responsable.nombre.toLowerCase().includes(this.nombreBusqueda.toLowerCase())
    );
    this.mostrarSugerencias = this.clientesFiltrados.length > 0;
  }

  // Método para seleccionar un responsable de las sugerencias
  seleccionarCliente(cliente: any) {
    this.clientesSeleccionado = cliente;
    this.nombreBusqueda = cliente.nombre;
    this.mostrarSugerencias = false;
    this.error = '';
  }

  // Método para buscar por nombre
  buscarPorNombre() {
    if (!this.clientesSeleccionado) {
      this.error = 'Por favor, selecciona un responsable de la lista.';
      return;
    }

    this.mostrarBuscador = false;
    this.cargarDetalleCliente(this.clientesSeleccionado.id_cliente);
  }

  // Método para volver al buscador
  volverAlBuscador() {
    this.mostrarBuscador = true;
    this.detalleCliente = null;
    this.error = '';
    this.nombreBusqueda = '';
    this.clientesSeleccionado = null;
    this.mostrarSugerencias = false;
    this.loading = false;
  }
}