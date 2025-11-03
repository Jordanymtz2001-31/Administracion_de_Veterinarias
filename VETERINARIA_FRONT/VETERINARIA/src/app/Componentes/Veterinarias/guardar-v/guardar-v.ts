import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Servidor } from '../../../Servidor/servidor';
import { Veterinaria } from '../../../Entidad/veterinaria';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guardar-v',
  imports: [FormsModule, CommonModule],
  templateUrl: './guardar-v.html',
  styleUrl: './guardar-v.css',
})
export class GuardarV implements OnInit, AfterViewInit{

  constructor(private router: Router, private service: Servidor) { }

  veterinaria: Veterinaria = new Veterinaria();
  loading = false;
  mensaje = '';
  esError = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const section = document.getElementById('guardar-cliente-section');
      section?.scrollIntoView({ behavior: 'smooth' , block: 'start' });
  }, 200);
  }
  ngOnInit(): void {
    this.veterinaria = {
      id_veterinaria : 0,
      nombre : '',
      direccion : '',
      telefono : '',
    };
  }
  
  guardarVeterinaria() {
    this.loading = true;
    this.mensaje = '';

    this.service.guardarVeterinaria(this.veterinaria).subscribe({
      next: (data) => {
        this.loading = false;
        this.mensaje = 'Veterinaria guardado exitosamente.', false;

        // Limpiar el formulario después de guardar
        this.veterinaria = {
          id_veterinaria : 0,
          nombre : '',
          direccion : '',
          telefono : ''
        };

        setTimeout(() => {
          this.router.navigate(['/listar-veterinarias']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al guardar veterinaria:', err);
        this.loading = false;
        this.mostrarMensaje('Error al guardar veterinaria: ' + (err.error?.message || err.message), true);
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
      this.router.navigate(['listar-veterinaria']);
    }
  }

  volverInicio() {
    this.router.navigate(['/']).then(() => {
      const menu = document.getElementById('menu-section');
      menu?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

