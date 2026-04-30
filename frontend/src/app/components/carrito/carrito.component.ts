import { Component, computed, Signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { Product } from '../../models/producto.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  carrito: Signal<Product[]>;
  total = computed(() => this.carritoService.total());

  constructor(
    private carritoService: CarritoService,
    private paypalService: PaypalService
  ) {
    this.carrito = this.carritoService.carrito;
  }

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }

  exportarXML() {
    this.carritoService.exportarXML();
  }

  pagarConPaypal() {
    const payload = {
      total: this.total(),
      items: this.carrito().map((producto) => ({
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: producto.cantidad || 1
      }))
    };

    this.paypalService.createOrder(payload).subscribe({
      next: (order: any) => {
        window.location.href = order.approveUrl;
      },
      error: (err) => {
        console.error('Error PayPal:', err);
        alert('Error al conectar con PayPal');
      }
    });
  }
}