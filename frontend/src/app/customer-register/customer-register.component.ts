// frontend/src/app/customer-register/customer-register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CustomerRegisterComponent {
  registerForm: FormGroup;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.apiService.registerCustomer(this.registerForm.value).subscribe({
        next: (response) => {
          this.message = response.message;
          this.isError = false;
          setTimeout(() => {
            this.router.navigate(['/customer/login']);
          }, 2000);
        },
        error: (error) => {
          this.message = error.error.message || 'Registration failed!';
          this.isError = true;
        }
      });
    }
  }
}