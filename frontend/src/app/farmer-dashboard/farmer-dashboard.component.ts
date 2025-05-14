// src/app/farmer-dashboard/farmer-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

interface Item {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  farmerName: string;
  farmerMobile: string;
  farmerCity: string;
}

interface Purchase {
  _id: string;
  itemName: string;
  price: number;
  quantity: number;
  customerName: string;
  customerMobile: string;
  customerCity: string;
  purchaseDate: string;
}

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.component.html',
  styleUrls: ['./farmer-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [DatePipe]
})
export class FarmerDashboardComponent implements OnInit {
  farmerDetails: any = {};
  items: Item[] = [];
  purchases: Purchase[] = [];
  newItem = {
    name: '',
    price: 0,
    quantity: 0
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.farmerDetails = this.authService.getFarmerDetails();
    if (!this.farmerDetails?.mobile) {
      this.authService.logout();
      this.router.navigate(['/farmer/login']);
      return;
    }
    this.fetchItems();
    this.fetchPurchases();
  }

  fetchItems(): void {
    this.apiService.getItems(this.farmerDetails.mobile).subscribe({
      next: (response: Item[]) => {
        this.items = response;
      },
      error: (error: any) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  fetchPurchases(): void {
    this.apiService.getPurchases(this.farmerDetails.mobile).subscribe({
      next: (response: Purchase[]) => {
        this.purchases = response;
      },
      error: (error: any) => {
        console.error('Error fetching purchases:', error);
      }
    });
  }

  addItem(): void {
    if (!this.newItem.name || this.newItem.price <= 0 || this.newItem.quantity <= 0) {
      alert('Please fill all fields with valid values');
      return;
    }

    const itemData = {
      ...this.newItem,
      farmerName: this.farmerDetails.name,
      farmerMobile: this.farmerDetails.mobile,
      farmerCity: this.farmerDetails.city
    };

    this.apiService.addItem(itemData).subscribe({
      next: () => {
        alert('Item added successfully!');
        this.newItem = {
          name: '',
          price: 0,
          quantity: 0
        };
        this.fetchItems();
      },
      error: (error: any) => {
        console.error('Error adding item:', error);
        alert('Failed to add item. Please try again.');
      }
    });
  }

  editItem(item: Item): void {
    const newName = prompt('Enter new item name:', item.name);
    const newPrice = prompt('Enter new price per Kg:', item.price.toString());
    const newQuantity = prompt('Enter new total quantity:', item.quantity.toString());

    if (newName && newPrice && newQuantity) {
      const updatedItem = {
        name: newName,
        price: parseFloat(newPrice),
        quantity: parseInt(newQuantity, 10)
      };
      
      this.apiService.updateItem(item._id, updatedItem).subscribe({
        next: () => {
          alert('Item updated successfully!');
          this.fetchItems();
        },
        error: (error: any) => {
          console.error('Error updating item:', error);
          alert('Failed to update item. Please try again.');
        }
      });
    }
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deleteItem(id).subscribe({
        next: () => {
          alert('Item deleted successfully!');
          this.fetchItems();
        },
        error: (error: any) => {
          console.error('Error deleting item:', error);
          alert('Failed to delete item. Please try again.');
        }
      });
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'medium') || date;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/farmer/login']);
  }
}