import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FarmerRegisterComponent } from './farmer-register/farmer-register.component';
import { FarmerLoginComponent } from './farmer-login/farmer-login.component';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

import { AuthService } from './shared/auth.service';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'farmer/register', component: FarmerRegisterComponent },
      { path: 'farmer/login', component: FarmerLoginComponent },
      { path: 'farmer/dashboard', component: FarmerDashboardComponent },
      { path: 'customer/register', component: CustomerRegisterComponent },
      { path: 'customer/login', component: CustomerLoginComponent },
      { path: 'customer/dashboard', component: CustomerDashboardComponent }
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5000'],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    AuthService
  ]
})
export class AppModule { }