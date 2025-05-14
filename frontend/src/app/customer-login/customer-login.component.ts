// frontend/src/app/customer-login/customer-login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CustomerLoginComponent {
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.loginCustomer(this.loginForm.value).subscribe({
        next: (response) => {
          this.message = response.message;
          this.isError = false;
          const customerDetails = {
            name: response.customer.name,
            mobile: response.customer.mobile,
            city: response.customer.city,
            address: response.customer.address
          };
          this.authService.setCustomerDetails(customerDetails);
          if (response.token) {
            localStorage.setItem('access_token', response.token);
          }
          setTimeout(() => {
            this.router.navigate(['/customer/dashboard']);
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