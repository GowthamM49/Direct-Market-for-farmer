// src/app/shared/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) { }

  setFarmerDetails(details: any) {
    localStorage.setItem('farmerMobile', details.mobile);
    localStorage.setItem('farmerName', details.name);
    localStorage.setItem('farmerCity', details.city);
  }

  setCustomerDetails(details: any) {
    localStorage.setItem('customerMobile', details.mobile);
    localStorage.setItem('customerName', details.name);
    localStorage.setItem('customerCity', details.city);
  }

  getFarmerDetails() {
    return {
      mobile: localStorage.getItem('farmerMobile'),
      name: localStorage.getItem('farmerName'),
      city: localStorage.getItem('farmerCity')
    };
  }

  getCustomerDetails() {
    return {
      mobile: localStorage.getItem('customerMobile'),
      name: localStorage.getItem('customerName'),
      city: localStorage.getItem('customerCity')
    };
  }

  isFarmerLoggedIn() {
    return !!localStorage.getItem('farmerMobile');
  }

  isCustomerLoggedIn() {
    return !!localStorage.getItem('customerMobile');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  canActivate(route: any): boolean {
    const role = route.data['role'];
    if (role === 'farmer' && this.isFarmerLoggedIn()) {
      return true;
    }
    if (role === 'customer' && this.isCustomerLoggedIn()) {
      return true;
    }
    this.router.navigate([`/${role}/login`]);
    return false;
  }
}