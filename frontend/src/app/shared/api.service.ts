// src/app/shared/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  registerFarmer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/farmers/register`, data);
  }

  loginFarmer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/farmers/login`, data);
  }

  registerCustomer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customers/register`, data);
  }

  loginCustomer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/customers/login`, data);
  }

  getCustomer(mobile: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/customers/${mobile}`);
  }

  getItems(farmerMobile?: string): Observable<any> {
    const params: any = {};
    if (farmerMobile) params.farmerMobile = farmerMobile;
    return this.http.get(`${this.apiUrl}/items`, { params });
  }

  addItem(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, data);
  }

  updateItem(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${id}`, data);
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${id}`);
  }

  getPurchases(farmerMobile: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/purchases`, { params: { farmerMobile } });
  }

  createPurchase(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/purchases`, data);
  }
}