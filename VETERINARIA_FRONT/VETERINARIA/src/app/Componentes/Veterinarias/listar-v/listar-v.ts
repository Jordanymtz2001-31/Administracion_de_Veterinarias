import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servidor } from '../../../Servidor/servidor';
import { Veterinaria } from '../../../Entidad/veterinaria';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-v',
  imports: [FormsModule, CommonModule],
  templateUrl: './listar-v.html',
  styleUrl: './listar-v.css',
})
export class ListarV implements OnInit, AfterViewInit {

  constructor(private router:Router, private servidor: Servidor) { }

  // Crear una lista para almacenar los clientes
  veterinarias!: Veterinaria[];
  loading = true;
  veterinaria = new Veterinaria();


  // El metodo ngAfterViewInit se ejecuta despues de que la vista se ha inicializado
  ngAfterViewInit(): void {
    setTimeout (() => {
      const section = document.getElementById('clientes-section');
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  // El metodo ngOnInit se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.servidor.listarVeterinaria().subscribe({
      next: (data) => {
        this.veterinarias = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar veterinarias', err);
        this.loading = false;
      },
    });
  }

  eliminarVeterinaria(id : number){
    if(confirm('¿Esta seguro de que quiere eliminar la veterinaria?')){
      this.servidor.eliminarVeterinaria(id).subscribe({
        next: () => {
          this.veterinarias = this.veterinarias.filter((c) => c.id_veterinaria !== id);
        },
        error: (err) => console.error('Error  al eliminar la veterinaria:', err),
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
  editarVeterinaria(id: number){
    this.router.navigate(['/editar-veterinaria', id]);
  }
}
