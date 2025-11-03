import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Clientes } from '../Entidad/clientes';
import { Observable } from 'rxjs';
import { Mascotas } from '../Entidad/mascotas';
import { Responsables } from '../Entidad/responsables';
import { Veterinaria } from '../Entidad/veterinaria';

@Injectable({
  providedIn: 'root',
})
export class Servidor {

  // Creamos el constructor y le inyectamos el servicio HttpClient
  constructor(private http: HttpClient) { }

  // Definimos la URL base del servidor
  url = 'http://localhost:8080/'; // Ruta del servidor gateway

  //Metodos de cliente
  listarClientes() {
    return this.http.get<Clientes>(this.url + 'clientes/');
  }

  guardarCliente(cliente: Clientes): Observable<HttpResponse<Clientes>> {
    return this.http.post<Clientes>(this.url + 'clientes/', cliente, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  buscarCliente(id: number) {
    return this.http.get<Clientes>(this.url + 'clientes/' + id + '/');
  }

  eliminarCliente(id: number) {
    return this.http.delete(this.url + 'clientes/' + id + '/');
  }

  editarCliente(id: number, cliente: Clientes): Observable<HttpResponse<Clientes>> {
    return this.http.patch<Clientes>(this.url + 'clientes/' + id + '/', cliente, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  detalleCliente(id: number) {
    return this.http.get<any>(this.url + 'clientes/detalle_cliente/' + id + '/');
  }

  //Metodos de mascota
  listarMascotas() {
    return this.http.get<Mascotas>(this.url + 'mascotas/');
  }
  guardarMascota(mascota: Mascotas): Observable<HttpResponse<Mascotas>> {
    return this.http.post<Mascotas>(this.url + 'mascotas/', mascota, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  buscarMascota(id: number) {
    return this.http.get<Mascotas>(this.url + 'mascotas/' + id + '/');
  }

  eliminarMascota(id: number) {
    return this.http.delete(this.url + 'mascotas/' + id + '/');
  }

  editarMascota(id: number, mascota: Mascotas): Observable<HttpResponse<Mascotas>> {
    return this.http.patch<Mascotas>(this.url + 'mascotas/' + id + '/', mascota, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  //Metodos de responsable
  listarResponsable() {
    return this.http.get<Responsables>(this.url + 'responsable/');
  }

  guardarResponsable(responsable: Responsables): Observable<HttpResponse<Responsables>> {
    return this.http.post<Responsables>(this.url + 'responsable/', responsable, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  buscarResponsable(id: number) {
    return this.http.get<Responsables>(this.url + 'responsable/' + id + '/');
  }

  eliminarResponsable(id: number) {
    return this.http.delete(this.url + 'responsable/' + id + '/');
  }

  editarResponsable(id: number, responsable: Responsables): Observable<HttpResponse<Responsables>> {
    return this.http.patch<Responsables>(this.url + 'responsable/' + id + '/', responsable, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  detalleResponsable(id: number) {
    return this.http.get<any>(this.url + 'responsable/detalle_responsable/' + id + '/');
  }

  // Metodos de Veterinaria
  listarVeterinaria() {
    return this.http.get<Veterinaria>(this.url + 'veterinarias/');
  }

  guardarVeterinaria(veterinaria: Veterinaria): Observable<HttpResponse<Veterinaria>> {
    return this.http.post<Veterinaria>(this.url + 'veterinarias/', veterinaria, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  buscarVeterinaria(id: number) {
    return this.http.get<Veterinaria>(this.url + 'veterinarias/' + id + '/');
  }

  eliminarVeterinaria(id: number) {
    return this.http.delete(this.url + 'veterinarias/' + id + '/');
  }

  editarVeterinaria(id: number, veterinaria: Veterinaria): Observable<HttpResponse<Veterinaria>> {
    return this.http.patch<Veterinaria>(this.url + 'veterinarias/' + id + '/', veterinaria, { observe: 'response' });
    // El observe nos permite observar la respuesta completa del servidor
  }

  detalleVeterinaria(id: number) {
    return this.http.get<any>(this.url + 'veterinarias/detalle-veterinaria/' + id + '/');
  }
  
}
