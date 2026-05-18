import { Component, computed, Signal, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { Product } from '../../models/producto.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  carrito: Signal<Product[]>;
  total = computed(() => this.carritoService.total());

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor(
    private carritoService: CarritoService,
    private paypalService: PaypalService
  ) {
    this.carrito = this.carritoService.carrito;
  }

  ngOnInit() {
    // Cuando PayPal redirige de vuelta, trae ?token=ORDER_ID&PayerID=...
    const token = this.route.snapshot.queryParamMap.get('token');
    const payerId = this.route.snapshot.queryParamMap.get('PayerID');

    if (token && payerId) {
      this.paypalService.captureOrder(token).subscribe({
        next: (result: any) => {
          console.log('Pago completado:', result);
          this.carritoService.vaciar();
          this.router.navigate(['/seguimiento'], {
            queryParams: { orderId: result.id, status: result.status }
          });
        },
        error: (err: any) => {
          console.error('Error capturando orden:', err);
          alert('Hubo un error al confirmar el pago. Intenta de nuevo.');
        }
      });
    }
  }

  trackByProductId(index: number, producto: Product): number {
    return producto.id;
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
        // PayPal devuelve links[], buscamos el de 'approve'
        const approveLink = order.links?.find(
          (link: any) => link.rel === 'approve'
        );

        if (approveLink?.href) {
          window.location.href = approveLink.href;
        } else {
          console.error('No se encontró el link de aprobación:', order);
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