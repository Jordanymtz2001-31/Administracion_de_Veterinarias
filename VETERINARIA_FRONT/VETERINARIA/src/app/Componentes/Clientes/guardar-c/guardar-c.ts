import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servidor } from '../../../Servidor/servidor';
import { Clientes } from '../../../Entidad/clientes';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guardar-c',
  imports: [FormsModule],
  templateUrl: './guardar-c.html',
  styleUrl: './guardar-c.css',
})
export class GuardarC implements OnInit, AfterViewInit{

  constructor(private router: Router, private service: Servidor) { }

  cliente: Clientes = new Clientes();
  loading = false;
  mensaje = '';
  esError = false;

  // Lista de dropdowns
  veterinarias: any[] = []
  cargandoDatos = true

  // Funcion del scrollView
  ngAfterViewInit(): void {
    setTimeout(() => {
      const section = document.getElementById('guardar-cliente-section');
      section?.scrollIntoView({ behavior: 'smooth' , block: 'start' });
  }, 200);
  }
  ngOnInit(): void {
    this.cliente = {
      id_cliente : 0,
      nombre : '',
      direccion : '',
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
  
  guardarCliente() {

    //// Validar que se hayan seleccionado las relaciones requeridas
    if (!this.cliente.id_veterinaria || this.cliente.id_veterinaria === 0) {
      this.mostrarMensaje('Por favor selecciona una veterinaria para el cliente', true);
      return;
    }

    this.loading = true;
    this.mensaje = '';

    this.service.guardarCliente(this.cliente).subscribe({
      next: (data) => {
        this.loading = false;
        this.mostrarMensaje('Cliente guardado exitosamente.', false);

        // Limpiar el formulario después de guardar
        this.cliente = {
          id_cliente : 0,
          nombre : '',
          direccion : '',
          contacto : '',
          id_veterinaria: 0,
        };

        setTimeout(() => {
          this.router.navigate(['/listar-clientes']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al guardar el cliente:', err);
        this.loading = false;
        this.mostrarMensaje('Error al guardar el cliente: ' + (err.error?.message || err.message), true);
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

