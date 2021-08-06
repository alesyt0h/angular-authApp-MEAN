import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _baseUrl:  string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario(){
    return {...this._usuario};
  }

  constructor(private _http: HttpClient) { }

  registro( name: string, email: string, password: string){
    const url  = `${this._baseUrl}/auth/new`
    const body = {name, email, password} 

    return this._http.post<AuthResponse>(url, body)
        .pipe(
          tap( ({ok, token}) => {  // Desestructuro el Ok y el token de la respuesta //// 1era manera de hacerlo, la otra esta en el login
            if (ok){
              localStorage.setItem('token', token!)
              // 
              // No es necesario aqui puesto que siempre nos va a redirigir al dashboard y ahi se esta ejecutando la validación de token, donde ya añado estos datos
              //
              // this._usuario = { 
              //   name: resp.name!, 
              //   uid: resp.uid!,
              //   email: resp.email!
              // }
            }
          }),
          map(resp => resp.ok),
          catchError(err => of(err.error.msg))
        )
  }


  login(email: string, password: string){
    
    const url  = `${this._baseUrl}/auth`
    const body = {email, password} 
    
    return this._http.post<AuthResponse>(url, {email, password}) // Sending {email, password} Instead of body will work aswell
        .pipe(
          tap( resp => { //2nda manera sin desestructurar, creo que prefiero esta
            if (resp.ok){
              localStorage.setItem('token', resp.token!)
              // 
              // No es necesario aqui puesto que siempre nos va a redirigir al dashboard y ahi se esta ejecutando la validación de token, donde ya añado estos datos
              //
              // this._usuario = { 
              //   name: resp.name!, 
              //   uid: resp.uid!,
              //   email: resp.email!
              // }
            }
          }),
          map(resp => resp.ok),
          catchError(err => of(err.error.msg))
        )
  }



  validarToken(): Observable<boolean> {
    const url = `${this._baseUrl}/auth/renew`
    const headers = new HttpHeaders()
        .set('x-token', localStorage.getItem('token') || '');

    return this._http.get<AuthResponse>(url, {headers})
        .pipe(
          map(resp => {
            localStorage.setItem('token', resp.token!)
            this._usuario = { 
              name: resp.name!, 
              uid: resp.uid!,
              email: resp.email!
            }
            return resp.ok;
          }),
          catchError(err => of(false))
        );
  }

  logout() {
    localStorage.removeItem('token');
  }
}
