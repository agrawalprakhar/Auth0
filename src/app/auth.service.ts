import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://dev-zmnne4e43jfo6tth.us.auth0.com/api/v2';
  private auth0Domain = 'dev-zmnne4e43jfo6tth.us.auth0.com';

  
  private jwtHelper: JwtHelperService = new JwtHelperService();
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('https://dev-zmnne4e43jfo6tth.us.auth0.com/oauth/token', {
      username: username,
      password: password,
      grant_type: "password",
      client_id: "2Soefe9eKRoryvI6mO1NpJSdVvL6MROm",
      client_secret: "645vJV2GpjT4_UVJekIvyI5PvZ80_VBuZS9ur277W_zEomjK7ECpodKE0vTwRNLZ",
      audience: "https://dev-zmnne4e43jfo6tth.us.auth0.com/api/v2/"
    }).pipe(
      tap(response => {
        const accessToken = response.access_token;
       localStorage.setItem("access_token",accessToken)
      })
    );
  }
  
  
  signup(email: string, password: string) {
    const token = this.getToken();
  if (!token) {
    console.error('No access token available');
    return;
  }
    this.http.post<any>(`${this.apiUrl}/users`, {
      email: email,
      password: password,
      connection: 'Username-Password-Authentication'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe(
      response => {
        console.log('User created successfully:', response);
        // Handle success, e.g., redirect to login page
      },
      error => {
        console.error('Signup failed:', error);
        // Handle error
      }
    );
  }
  logout() {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  getUserProfile(email: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.error('No access token available');
      return of(null); // Return an observable with null value
    }

    // Construct the URL with email as a query parameter
    const url = `${this.apiUrl}/users?q=email:"${email}"`;

    return this.http.get<any>(url, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe(
      catchError(error => {
        console.error('Failed to fetch user profile:', error);
        return of(null); // Return an observable with null value in case of error
      })
    );
  }
}
