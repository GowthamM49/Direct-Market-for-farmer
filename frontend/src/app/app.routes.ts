import { Routes } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { HomeComponent } from './home/home.component';
import { FarmerRegisterComponent } from './farmer-register/farmer-register.component';
import { FarmerLoginComponent } from './farmer-login/farmer-login.component';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';
import { CustomerRegistrationComponent } from './components/customer-registration/customer-registration.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'farmer/register',
    component: FarmerRegisterComponent
  },
  {
    path: 'farmer/login',
    component: FarmerLoginComponent
  },
  {
    path: 'farmer/dashboard',
    component: FarmerDashboardComponent,
    canActivate: [AuthService],
    data: { role: 'farmer' }
  },
  {
    path: 'customer/register',
    component: CustomerRegistrationComponent
  },
  {
    path: 'customer/login',
    component: CustomerLoginComponent
  },
  {
    path: 'customer/dashboard',
    component: CustomerDashboardComponent,
    canActivate: [AuthService],
    data: { role: 'customer' }
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];