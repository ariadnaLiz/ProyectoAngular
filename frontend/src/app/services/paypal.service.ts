import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/paypal`;

  createOrder(payload: { items: any[]; total: number }) {
    return this.http.post<any>(
      `${this.apiUrl}/create-order`,
      payload
    );
  }

  captureOrder(orderId: string) {
    return this.http.post<any>(
      `${this.apiUrl}/capture-order/${orderId}`,
      {}
    );
  }
}