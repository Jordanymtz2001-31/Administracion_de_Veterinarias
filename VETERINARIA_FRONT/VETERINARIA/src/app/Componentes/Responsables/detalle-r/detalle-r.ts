import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Servidor } from '../../../Servidor/servidor';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-r',
  imports: [FormsModule, CommonModule],
  templateUrl: './detalle-r.html',
  styleUrl: './detalle-r.css',
})
export class DetalleR implements OnInit, AfterViewInit {

  constructor(private servidor: Servidor, private router: Router, private route: ActivatedRoute) {}

  detalleResponsable: any = null;
  loading = false;
  error = '';
  mostrarBuscador = true;
  nombreBusqueda = '';         
  responsables: any[] = [];    
  responsablesFiltrados: any[] = []; // Corregido el nombre
  responsableSeleccionado: any = null; // Corregido el nombre
  mostrarSugerencias = false;

  // El metodo ngAfterViewInit se ejecuta despues de que la vista se ha inicializado
  ngAfterViewInit(): void {
    setTimeout (() => {
      const section = document.getElementById('detalle-tienda-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  ngOnInit(): void {
    this.obtenerIdResponsable();
  }

  obtenerIdResponsable() {
    // Ya no necesitamos obtener el ID de la URL, siempre mostramos el buscador
    this.mostrarBuscador = true;
    this.loading = false;
    // Cargar la lista de responsables para el buscador
    this.cargarResponsables();
  }

  cargarDetalleResponsable(id: number) {
    this.loading = true;
    this.error = '';
    this.servidor.detalleResponsable(id).subscribe({
      next: (data: any) => {
        console.log('Responsable encontrado:', data.responsable.nombre);
        console.log('Mascotas:', Array.isArray(data.mascotas) ? `${data.mascotas.length} mascotas` : data.mascotas);
        this.detalleResponsable = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el detalle de responsable:', err);
        this.error = err.error?.Error || 'Error al cargar el detalle de responsable.';
        this.loading = false;
      }
    });
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }

  volverAlistar() {
    this.router.navigate(['listar-responsables']);
  }

  volerInicio() {
    this.router.navigate(['/']).then(() => {
      const menu = document.getElementById('menu-section');
      menu?.scrollIntoView({ behavior: 'smooth', block: 'start'});
    });
  }

  // Método para cargar todas las veterinarias
  cargarResponsables() {
    this.loading = true;
    this.servidor.listarResponsable().subscribe({
      next: (data: any) => {
        this.responsables = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar responsables:', err);
        this.error = 'Error al cargar la lista de responsables.';
        this.loading = false;
      }
    });
  }

  // Método para filtrar responsables mientras el usuario escribe
  filtrarResponsable() {
    if (!this.nombreBusqueda.trim()) {
      this.responsablesFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.responsablesFiltrados = this.responsables.filter(responsable => 
      responsable.nombre.toLowerCase().includes(this.nombreBusqueda.toLowerCase())
    );
    this.mostrarSugerencias = this.responsablesFiltrados.length > 0;
  }

  // Método para seleccionar un responsable de las sugerencias
  seleccionarResponsable(responsable: any) {
    this.responsableSeleccionado = responsable;
    this.nombreBusqueda = responsable.nombre;
    this.mostrarSugerencias = false;
    this.error = '';
  }

  // Método para buscar por nombre
  buscarPorNombre() {
    if (!this.responsableSeleccionado) {
      this.error = 'Por favor, selecciona un responsable de la lista.';
      return;
    }

    this.mostrarBuscador = false;
    this.cargarDetalleResponsable(this.responsableSeleccionado.id_responsable);
  }

  // Método para volver al buscador
  volverAlBuscador() {
    this.mostrarBuscador = true;
    this.detalleResponsable = null;
    this.error = '';
    this.nombreBusqueda = '';
    this.responsableSeleccionado = null;
    this.mostrarSugerencias = false;
    this.loading = false;
  }
}