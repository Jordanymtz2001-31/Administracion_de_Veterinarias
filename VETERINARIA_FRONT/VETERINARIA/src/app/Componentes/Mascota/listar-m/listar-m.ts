import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servidor } from '../../../Servidor/servidor';
import { Mascotas } from '../../../Entidad/mascotas';

@Component({
  selector: 'app-listar-m',
  imports: [],
  templateUrl: './listar-m.html',
  styleUrl: './listar-m.css',
})
export class ListarM  implements OnInit, AfterViewInit {

  constructor(private router:Router, private servidor: Servidor) { }

  // Crear una lista para almacenar los clientes
  mascotas!: Mascotas[];
  loading = true;
  mascota = new Mascotas();


  // El metodo ngAfterViewInit se ejecuta despues de que la vista se ha inicializado
  ngAfterViewInit(): void {
    setTimeout (() => {
      const section = document.getElementById('clientes-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  // El metodo ngOnInit se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.servidor.listarMascotas().subscribe({
      next: (data) => {
        this.mascotas = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las mascotas', err);
        this.loading = false;
      },
    });
  }

  eliminarMascota(id : number){
    if(confirm('¿Esta seguro de que quiere eliminar la mascota?')){
      this.servidor.eliminarMascota(id).subscribe({
        next: () => {
          this.mascotas = this.mascotas.filter((c) => c.id_cliente !== id);
        },
        error: (err) => console.error('Error  al eliminar a la mascota:', err),
      })
    }
  }

  volverInicio(){
    this.router.navigate(['/']).then(() => {
      const menu = document.getElementById('menu-section');
      menu?.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  }
  //metodo para editar cliente
  editarMascota(id: number){
    this.router.navigate(['/editar-mascota', id]);
  }
}

