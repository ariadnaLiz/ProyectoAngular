import { Component, computed, Signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { Product } from '../../models/producto.model';

@Component({
  selector: 'app-carrito-full',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './carrito-full.component.html',
  styleUrls: ['./carrito-full.component.css'],
})
export class CarritoFullComponent implements OnInit {
  carrito: Signal<Product[]>;
  envio = 150;

  subtotal = computed(() =>
    this.carritoService.carrito().reduce(
      (sum, p) => sum + p.precio * (p.cantidad || 1),
      0
    )
  );

  total = computed(() => this.subtotal() + this.envio);

  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  constructor(
    public carritoService: CarritoService,
    private paypalService: PaypalService,
    private router: Router
  ) {
    this.carrito = this.carritoService.carrito;
  }

  ngOnInit() {
  if (!isPlatformBrowser(this.platformId)) return;

  const token = this.route.snapshot.queryParamMap.get('token');
  const payerId = this.route.snapshot.queryParamMap.get('PayerID');

  if (token && payerId) {
    const subtotal = this.subtotal();

    this.paypalService.captureOrder(token).subscribe({
      next: (result: any) => {
        this.carritoService.vaciar();
        this.router.navigate(['/seguimiento'], {
          queryParams: { 
            orderId: result.id, 
            status: result.status,
            subtotal: subtotal
          }
        });
      },
      error: (err: any) => {
        console.error('Error capturando orden:', err);
        this.router.navigate(['/carrito']);
        alert('Error al confirmar el pago. Intenta de nuevo.');
      }
    });
  }
}

  quitar(id: number) { this.carritoService.quitar(id); }
  vaciar() { this.carritoService.vaciar(); }
  continuarComprando() { this.router.navigate(['/']); }
  pagar() { this.pagarConPaypal(); }

  pagarConPaypal() {
    const payload = {
      total: this.total(),
      items: [
        ...this.carritoService.carrito().map(p => ({
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad || 1
        })),
        { nombre: 'Envío', precio: this.envio, cantidad: 1 }
      ]
    };

    this.paypalService.createOrder(payload).subscribe({
      next: (order: any) => {
        if (order.approveUrl) {
          window.location.href = order.approveUrl;
        } else {
          alert('Error: no se pudo obtener el link de pago.');
        }
      },
      error: (err: any) => {
        console.error('Error PayPal:', err);
        alert('Error al conectar con PayPal');
      }
    });
  }
}