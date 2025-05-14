// frontend/src/app/farmer-login/farmer-login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-farmer-login',
  templateUrl: './farmer-login.component.html',
  styleUrls: ['./farmer-login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class FarmerLoginComponent {
  loginForm: FormGroup;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.loginFarmer(this.loginForm.value).subscribe({
        next: (response) => {
          this.message = response.message;
          this.isError = false;
          this.authService.setFarmerDetails(response.farmer);
          if (response.token) {
            localStorage.setItem('access_token', response.token);
          }
          setTimeout(() => {
            this.router.navigate(['/farmer/dashboard']);
          }, 1000);
        },
        error: (error) => {
          this.message = error.error.message || 'Login failed!';
          this.isError = true;
        }
      });
    }
  }
}