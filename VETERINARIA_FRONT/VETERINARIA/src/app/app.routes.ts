import { Routes } from '@angular/router';
import { ListarC } from './Componentes/Clientes/listar-c/listar-c';
import { ListarM } from './Componentes/Mascota/listar-m/listar-m';
import { ListarR } from './Componentes/Responsables/listar-r/listar-r';
import { ListarV } from './Componentes/Veterinarias/listar-v/listar-v';
import { GuardarC } from './Componentes/Clientes/guardar-c/guardar-c';
import { GuardarM } from './Componentes/Mascota/guardar-m/guardar-m';
import { GuardarR } from './Componentes/Responsables/guardar-r/guardar-r';
import { GuardarV } from './Componentes/Veterinarias/guardar-v/guardar-v';
import { DetalleC } from './Componentes/Clientes/detalle-c/detalle-c';
import { DetalleR } from './Componentes/Responsables/detalle-r/detalle-r';
import { DetalleV } from './Componentes/Veterinarias/detalle-v/detalle-v';
import { EditarC } from './Componentes/Clientes/editar-c/editar-c';
import { EditarM } from './Componentes/Mascota/editar-m/editar-m';
import { EditarR } from './Componentes/Responsables/editar-r/editar-r';
import { EditarV } from './Componentes/Veterinarias/editar-v/editar-v';

export const routes: Routes = [
    // Rutas de Clientes
    {
        path: 'listar-clientes',
        component: ListarC
    },
    {
        path: 'listar-mascotas',
        component: ListarM
    },
    {
        path: 'listar-responsables',
        component: ListarR
    },
    {
        path: 'listar-veterinarias',
        component: ListarV
    },
    {
        path: 'guardar-cliente',
        component: GuardarC
    },
    {
        path: 'guardar-mascota',
        component: GuardarM
    },
    {
        path: 'guardar-responsable',
        component: GuardarR
    },
    {
        path: 'guardar-veterinaria',
        component: GuardarV
    },
    {
        path: 'detalles-cliente',
        component: DetalleC
    },
    {
        path: 'detalles-responsable',
        component: DetalleR
    },
    {
        path: 'detalles-veterinaria',
        component: DetalleV
    },
    {
        path: 'editar-cliente/:id',
        component: EditarC
    },
    {
        path: 'editar-mascota/:id',
        component: EditarM
    },
    {
        path: 'editar-responsable/:id',
        component: EditarR
    },
    {
        path: 'editar-veterinaria/:id',
        component: EditarV
    }
];
