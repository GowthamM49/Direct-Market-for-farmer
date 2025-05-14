// frontend/src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FarmerRegisterComponent } from './farmer-register/farmer-register.component';
import { FarmerLoginComponent } from './farmer-login/farmer-login.component';
import { FarmerDashboardComponent } from './farmer-dashboard/farmer-dashboard.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { AuthService } from './shared/auth.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'farmer/register', component: FarmerRegisterComponent },
  { path: 'farmer/login', component: FarmerLoginComponent },
  { 
    path: 'farmer/dashboard', 
    component: FarmerDashboardComponent,
    canActivate: [AuthService],
    data: { role: 'farmer' }
  },
  { path: 'customer/register', component: CustomerRegisterComponent },
  { path: 'customer/login', component: CustomerLoginComponent },
  { 
    path: 'customer/dashboard', 
    component: CustomerDashboardComponent,
    canActivate: [AuthService],
    data: { role: 'customer' }
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }