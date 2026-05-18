import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  orderId = signal('');
  loading = signal(true);
  error = signal(false);
  paymentDetails = signal<any>(null);

  estadoActual = signal(1);
  estados = [
    { id: 1, nombre: 'Pedido Confirmado', fecha: new Date().toLocaleDateString('es-MX') },
    { id: 2, nombre: 'En Preparación', fecha: '' },
    { id: 3, nombre: 'En Camino', fecha: '' },
    { id: 4, nombre: 'Entregado', fecha: '' }
  ];

  productos = signal<any[]>([]);
  subtotal = signal(0);
  envio = 150;
  iva = signal(0);
  total = signal(0);

  ngOnInit() {
  if (!isPlatformBrowser(this.platformId)) return;

  const orderId = this.route.snapshot.queryParams['orderId'];
  const status = this.route.snapshot.queryParams['status'];
  const subtotal = Number(this.route.snapshot.queryParams['subtotal'] || 0);

  if (!orderId || status !== 'COMPLETED') {
    this.error.set(true);
    this.loading.set(false);
    return;
  }

  this.orderId.set(orderId);
  this.subtotal.set(subtotal);
  this.iva.set(Math.round(subtotal * 0.16));
  this.total.set(subtotal + this.envio + this.iva());

  this.paymentDetails.set({ id: orderId, status });
  this.loading.set(false);
}

  getFechaEstimada(): string {
    const fecha = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    return fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  exportarXML() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<recibo>
  <orden_id>${this.orderId()}</orden_id>
  <fecha>${new Date().toISOString()}</fecha>
  <productos>
    ${this.productos().map(p => `
    <producto>
      <nombre>${p.nombre}</nombre>
      <precio>${p.precio}</precio>
    </producto>`).join('')}
  </productos>
  <subtotal>${this.subtotal()}</subtotal>
  <envio>${this.envio}</envio>
  <iva>${this.iva()}</iva>
  <total>${this.total()}</total>
</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${this.orderId()}.xml`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}