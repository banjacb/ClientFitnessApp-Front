import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private urlLogin="http://localhost:9000/users/login";
  
  private urlSendEmail='http://localhost:9000/users/confirm-account';
  

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Observable<any> {
    const request = { username: username, password: password };
    return this.http.post(this.urlLogin, request);
  }


  public sendEmail(email: string) : Observable<any>
  {
    const request={
      email: email
    };
    return this.http.post(this.urlSendEmail, request);

  }

  verifyToken(token: any): Observable<any> {
  
    console.log('gdej ovaj kod ispisujee '+ token);
    let params = new HttpParams().set('token', token);
    console.log(params);

    return this.http.get(this.urlSendEmail , { params: params });
  }

  public getUser(): any {
    const user = window.localStorage.getItem(config.USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public isLoggin(): boolean {
    if (typeof window !== 'undefined')
      {
    return this.getUser() !== null;
      }
      else{
        return false;
      }
  }

  public storeUser(user: any) {

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(config.USER_KEY);
      window.localStorage.setItem(config.USER_KEY, JSON.stringify(user));
  } else {
      console.error('Window object is not defined.');
  }
  
   
  }

  public logoutUser() {
  
    window.localStorage.removeItem(config.USER_KEY);
  }
  

  
}
