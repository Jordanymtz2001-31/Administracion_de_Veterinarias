import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Servidor } from '../../../Servidor/servidor';
import { Responsables } from '../../../Entidad/responsables';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guardar-r',
  imports: [FormsModule, CommonModule],
  templateUrl: './guardar-r.html',
  styleUrl: './guardar-r.css',
})
export class GuardarR implements OnInit, AfterViewInit{

  constructor(private router: Router, private service: Servidor) { }

  responsable: Responsables = new Responsables();
  loading = false;
  mensaje = '';
  esError = false;

  // Listas para los dropdowns
  veterinarias: any[] = [];
  cargandoDatos = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const section = document.getElementById('guardar-cliente-section');
      section?.scrollIntoView({ behavior: 'smooth' , block: 'start' });
  }, 200);
  }

  ngOnInit(): void {
    this.responsable = {
      id_responsable : 0,
      nombre : '',
      contacto : '',
      id_veterinaria: 0,
    };

    // Cargar los datos para los dropdowns
    this.cargarDatosFormulario();
  }

  cargarDatosFormulario(): void {
    this.cargandoDatos = true;

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
  
  guardarResponsable() {

    // Validamos 
    if (!this.responsable.id_veterinaria || this.responsable.id_veterinaria === 0) {
      this.mostrarMensaje('Por favor selecciona una veterinaria para el responsable', true);
      return;
    }

    this.loading = true;
    this.mensaje = '';

    this.service.guardarResponsable(this.responsable).subscribe({
      next: (data) => {
        this.loading = false;
        this.mensaje = 'Nuevo Encargado se guardado exitosamente.', false;

        // Limpiar el formulario después de guardar
        this.responsable = {
          id_responsable : 0,
          nombre : '',
          contacto : '',
          id_veterinaria: 0,
        };

        setTimeout(() => {
          this.router.navigate(['/listar-responsables']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al guardar el un nuevo encargado/responsable:', err);
        this.loading = false;
        this.mostrarMensaje('Error al guardar el encargado: ' + (err.error?.message || err.message), true);
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
      this.router.navigate(['listar-clientes']);
    }
  }

  volverInicio() {
    this.router.navigate(['/']).then(() => {
      const menu = document.getElementById('menu-section');
      menu?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}


