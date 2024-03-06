import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
email: any;
password: any;
isAuthenticated: boolean | undefined;
userProfile: any;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  login() {
    this.authService.login(this.email, this.password).subscribe(
      () => {
        // Successful login
        this.isAuthenticated = true;
        // Fetch user profile
        this.authService.getUserProfile(this.email).subscribe(
          userProfile => {
            this.userProfile = userProfile[0];
            
          },
          error => {
            console.error('Failed to fetch user profile:', error);
          }
        );
        // Redirect to a different page if needed
        // this.router.navigate(['/dashboard']);
      },
      error => {
        console.error('Login failed:', error);
        // Handle login error
      }
    );
  }
  
  logout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.userProfile = null;
  }
}
