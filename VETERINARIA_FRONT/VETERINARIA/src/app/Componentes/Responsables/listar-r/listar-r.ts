import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servidor } from '../../../Servidor/servidor';
import { Responsables } from '../../../Entidad/responsables';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-r',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-r.html',
  styleUrl: './listar-r.css',
})
export class ListarR implements OnInit, AfterViewInit {

  constructor(private router:Router, private servidor: Servidor) { }

  // Crear una lista para almacenar los clientes
  responsables!: Responsables[];
  loading = true;
  responsable = new Responsables();


  // El metodo ngAfterViewInit se ejecuta despues de que la vista se ha inicializado
  ngAfterViewInit(): void {
    setTimeout (() => {
      const section = document.getElementById('clientes-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  // El metodo ngOnInit se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.servidor.listarResponsable().subscribe({
      next: (data) => {
        this.responsables = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los responsables', err);
        this.loading = false;
      },
    });
  }

  eliminarResponsable(id : number){
    if(confirm('¿Esta seguro de que quiere eliminar el responsable?')){
      this.servidor.eliminarResponsable(id).subscribe({
        next: () => {
          this.responsables = this.responsables.filter((c) => c.id_responsable !== id);
        },
        error: (err) => console.error('Error  al eliminar el responsable:', err),
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
  editarResponsable(id: number){
    this.router.navigate(['/editar-responsable', id]);
  }
}

