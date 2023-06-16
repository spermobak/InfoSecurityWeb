import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginWindowVisible = false;
  isLoginFormVisible = false;
  

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
      .subscribe((response) => {
        this.router.navigate(['/checklist']);
      });
  }

  switchToRegistrationForm() {
    this.loginWindowVisible = true;
  }

  switchToLoginForm() {
    this.loginWindowVisible = false;
  }
}
