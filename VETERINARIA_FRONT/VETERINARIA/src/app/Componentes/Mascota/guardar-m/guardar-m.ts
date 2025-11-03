import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servidor } from '../../../Servidor/servidor';
import { Mascotas } from '../../../Entidad/mascotas';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guardar-m',
  imports: [FormsModule, CommonModule],
  templateUrl: './guardar-m.html',
  styleUrl: './guardar-m.css',
})
export class GuardarM implements OnInit, AfterViewInit{

  constructor(private router: Router, private service: Servidor) { }

  mascota: Mascotas = new Mascotas();
  loading = false;
  mensaje = '';
  esError = false;
  
  // Listas para los dropdowns
  clientes: any[] = [];
  responsables: any[] = [];
  veterinarias: any[] = [];
  cargandoDatos = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const section = document.getElementById('guardar-cliente-section');
      section?.scrollIntoView({ behavior: 'smooth' , block: 'start' });
  }, 200);
  }
  ngOnInit(): void {
    this.mascota = {
      id_mascota : 0,
      nombre : '',
      raza : '',
      edad : 0,
      razon_cita: '',
      id_cliente : 0,
      id_responsable : 0,
      id_veterinaria : 0,
    };
    
    // Cargar los datos para los dropdowns
    this.cargarDatosFormulario();
  }

  cargarDatosFormulario(): void {
    this.cargandoDatos = true;
    
    // Cargar clientes
    this.service.listarClientes().subscribe({
      next: (data: any) => {
        this.clientes = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.mostrarMensaje('Error al cargar la lista de clientes', true);
      }
    });

    // Cargar responsables
    this.service.listarResponsable().subscribe({
      next: (data: any) => {
        this.responsables = Array.isArray(data) ? data : [data];
      },
      error: (err) => {
        console.error('Error al cargar responsables:', err);
        this.mostrarMensaje('Error al cargar la lista de responsables', true);
      }
    });

    // Cargar veterinarias
    this.service.listarVeterinaria().subscribe({
      next: (data: any) => {
        this.veterinarias = Array.isArray(data) ? data : [data];
        this.cargandoDatos = false; // Terminamos cuando se carga la última lista
      },
      error: (err) => {
        console.error('Error al cargar veterinarias:', err);
        this.mostrarMensaje('Error al cargar la lista de veterinarias', true);
        this.cargandoDatos = false;
      }
    });
  }
  
  guardarMascota() {
    // Validar que se hayan seleccionado las relaciones requeridas
    if (!this.mascota.id_cliente || this.mascota.id_cliente === 0) {
      this.mostrarMensaje('Por favor selecciona un cliente para la mascota', true);
      return;
    }

    if (!this.mascota.id_responsable || this.mascota.id_responsable === 0) {
      this.mostrarMensaje('Por favor selecciona un responsable para la mascota', true);
      return;
    }

    if (!this.mascota.id_veterinaria || this.mascota.id_veterinaria === 0) {
      this.mostrarMensaje('Por favor selecciona una veterinaria para la mascota', true);
      return;
    }

    //Validamos edad de mascota
    if (this.mascota.edad < 0){
      this.mostrarMensaje('Por favor una edad correcta para la mascota', true);
      return
    }

    this.loading = true;
    this.mensaje = '';

    this.service.guardarMascota(this.mascota).subscribe({
      next: (data) => {
        this.loading = false;
        this.mostrarMensaje('Mascota guardada exitosamente', false);

        // Limpiar el formulario después de guardar
        this.mascota = {
          id_mascota : 0,
          nombre : '',
          raza : '',
          edad : 0,
          razon_cita: '',
          id_cliente : 0,
          id_responsable : 0,
          id_veterinaria : 0,
        };

        setTimeout(() => {
          this.router.navigate(['/listar-mascotas']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al guardar la mascota:', err);
        this.loading = false;
        this.mostrarMensaje('Error al guardar la mascota: ' + (err.error?.message || err.message), true);
      }
    });
  }

  private mostrarMensaje(texto: string, esError: boolean) {
    this.mensaje = texto;
    this.esError = esError;

    if (esError) {
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    }
  }

  cancelar() {
    if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
      this.router.navigate(['listar-mascotas']);
    }
  }

  volverInicio() {
    this.router.navigate(['/']).then(() => {
      const menu = document.getElementById('menu-section');
      menu?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}


