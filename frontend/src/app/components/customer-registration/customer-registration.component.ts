import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CustomerRegistrationComponent {
  registerForm: FormGroup;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: ['', Validators.required]
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