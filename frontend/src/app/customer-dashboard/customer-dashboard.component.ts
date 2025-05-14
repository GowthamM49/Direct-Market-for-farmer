import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  farmerName: string;
  farmerMobile: string;
  farmerCity: string;
}

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CustomerDashboardComponent implements OnInit {
  items: Item[] = [];
  customerDetails: any = {};
  quantities: { [key: string]: number } = {};

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.customerDetails = this.authService.getCustomerDetails();
    if (!this.customerDetails?.mobile) {
      this.authService.logout();
      this.router.navigate(['/customer/login']);
      return;
    }
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.apiService.getItems().subscribe({
      next: (response) => {
        this.items = response;
        // Initialize quantities with default 1 or available quantity (whichever is smaller)
        this.items.forEach(item => {
          this.quantities[item._id] = Math.min(1, item.quantity);
        });
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  buyItem(item: Item): void {
    const quantity = this.quantities[item._id];
    if (!quantity || quantity <= 0 || quantity > item.quantity) {
      alert(`Please enter a valid quantity (1-${item.quantity} Kg).`);
      return;
    }

    const purchaseData = {
      itemId: item._id,
      itemName: item.name,
      price: item.price,
      quantity: quantity,
      customerName: this.customerDetails.name,
      customerMobile: this.customerDetails.mobile,
      customerCity: this.customerDetails.city,
      farmerMobile: item.farmerMobile
    };

    this.apiService.createPurchase(purchaseData).subscribe({
      next: () => {
        alert(`You bought ${quantity} Kg of ${item.name} for ₹${(item.price * quantity).toFixed(2)}`);
        this.fetchProducts();
      },
      error: (error) => {
        console.error('Purchase error:', error);
        alert('Purchase failed. Please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/customer/login']);
  }
}