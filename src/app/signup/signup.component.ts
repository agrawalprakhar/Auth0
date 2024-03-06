import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string="";
  password: string ="";

  constructor(private authService: AuthService) {}

  signup() {
    this.authService.signup(this.email, this.password);
  }

}
