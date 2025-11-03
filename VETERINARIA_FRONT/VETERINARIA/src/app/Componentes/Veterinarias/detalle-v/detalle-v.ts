import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Servidor } from '../../../Servidor/servidor';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-v',
  imports: [FormsModule, CommonModule],
  templateUrl: './detalle-v.html',
  styleUrl: './detalle-v.css',
})
export class DetalleV implements OnInit, AfterViewInit {

  constructor(private servidor: Servidor, private router: Router, private route: ActivatedRoute) {}

  detalleVeterinaria: any = null;
  loading = false;
  error = '';
  mostrarBuscador = true;
  nombreBusqueda = '';         // Cambiado para buscar por nombre
  veterinarias: any[] = [];    // Lista de todas las veterinarias
  veterinariasFiltradas: any[] = []; // Lista filtrada para mostrar sugerencias
  veterinariaSeleccionada: any = null; // Veterinaria seleccionada
  mostrarSugerencias = false;

  // El metodo ngAfterViewInit se ejecuta despues de que la vista se ha inicializado
  ngAfterViewInit(): void {
    setTimeout (() => {
      const section = document.getElementById('detalle-tienda-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  ngOnInit(): void {
    this.obtenerIdVeterinaria();
  }

  obtenerIdVeterinaria() {
    // Ya no necesitamos obtener el ID de la URL, siempre mostramos el buscador
    this.mostrarBuscador = true;
    this.loading = false;
    // Cargar la lista de veterinarias para el buscador
    this.cargarVeterinarias();
  }

  cargarDetalleVeterinaria(id: number) {
    this.loading = true;
    this.error = '';
    this.servidor.detalleVeterinaria(id).subscribe({
      next: (data: any) => {
        console.log('Veterinaria encontrada:', data.veterinaria?.nombre || data.nombre);
        console.log('Responsables:', Array.isArray(data.responsables) ? `${data.responsables.length} responsables` : data.responsables);
        this.detalleVeterinaria = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error completo:', err);
        console.error('Status:', err.status);
        console.error('Error body:', err.error);
        console.error('Message:', err.message);
        
        if (err.status === 500) {
          this.error = `Error 500: ${err.error || 'Error interno del servidor'}. 
                        Verifica que el microservicio de veterinarias esté ejecutándose 
                        y que la veterinaria con ID ${this.veterinariaSeleccionada?.id_veterinaria} exista.`;
        } else {
          this.error = err.error?.Error || `Error ${err.status}: ${err.message}`;
        }
        this.loading = false;
      }
    });
  }

  esArray(valor: any): boolean {
    return Array.isArray(valor);
  }

  volverAlistar() {
    this.router.navigate(['listar-veterinarias']);
  }

  volerInicio() {
    this.router.navigate(['/']).then(() => {
      const menu = document.getElementById('menu-section');
      menu?.scrollIntoView({ behavior: 'smooth', block: 'start'});
    });
  }

  // Método para cargar todas las veterinarias
  cargarVeterinarias() {
    this.loading = true;
    this.servidor.listarVeterinaria().subscribe({
      next: (data: any) => {
        this.veterinarias = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar veterinarias:', err);
        this.error = 'Error al cargar la lista de veterinarias.';
        this.loading = false;
      }
    });
  }

  // Método para filtrar veterinarias mientras el usuario escribe
  filtrarVeterinarias() {
    if (!this.nombreBusqueda.trim()) {
      this.veterinariasFiltradas = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.veterinariasFiltradas = this.veterinarias.filter(vet => 
      vet.nombre.toLowerCase().includes(this.nombreBusqueda.toLowerCase())
    );
    this.mostrarSugerencias = this.veterinariasFiltradas.length > 0;
  }

  // Método para seleccionar una veterinaria de las sugerencias
  seleccionarVeterinaria(veterinaria: any) {
    this.veterinariaSeleccionada = veterinaria;
    this.nombreBusqueda = veterinaria.nombre;
    this.mostrarSugerencias = false;
    this.error = '';
  }

  // Método para buscar por nombre
  buscarPorNombre() {
    if (!this.veterinariaSeleccionada) {
      this.error = 'Por favor, selecciona una veterinaria de la lista.';
      return;
    }

    this.mostrarBuscador = false;
    this.cargarDetalleVeterinaria(this.veterinariaSeleccionada.id_veterinaria);
  }

  // Método para volver al buscador
  volverAlBuscador() {
    this.mostrarBuscador = true;
    this.detalleVeterinaria = null;
    this.error = '';
    this.nombreBusqueda = '';
    this.veterinariaSeleccionada = null;
    this.mostrarSugerencias = false;
    this.loading = false;
  }
}