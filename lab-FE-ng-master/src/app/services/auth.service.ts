import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '@models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private currentUser: User;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  signUp(email: string, password: string, name: string, role: number) {
    const url = `${environment.apiUrl}/signup`;
    return new Promise<string>((resolve, reject) => {
      this.http.post<any>(url, { email, password, name, role }).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  deleteUser(userId: string) {
    const url = `${environment.apiUrl}/users/delete`;
    return this.http.post<any>(url, { userId }).toPromise();
  }

  assignClassroom(id: string, classroom: string) {
    const url = `${environment.apiUrl}/assign`;
    return new Promise<void>((resolve, reject) => {
      this.http.post<any>(url, { id, classroom }).subscribe((data) => {
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  async signIn(email: string, password: string) {
    const url = `${environment.apiUrl}/login`;
    return new Promise<void>((resolve, reject) => {
      this.http.post<any>(url, { email, password }).subscribe((data) => {
        if (data && data.token) {
          this.setToken(data.token);
          this.setUser({
            email: data.email,
            name: data.name,
            role: data.role,
            classroom: data.classroom,
          });
        }
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  async signOut() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.token = null;
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  setUser(user: User) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser(): User {
    if (this.currentUser) {
      return this.currentUser;
    }
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return this.currentUser;
    }
    return null;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string {
    if (this.token) {
      return this.token;
    }
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      return this.token;
    }
    return null;
  }
}
