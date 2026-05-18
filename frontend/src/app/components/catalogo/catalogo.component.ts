import { Component, OnInit, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../models/producto.model';
import { ProductsService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent, NavbarComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent implements OnInit {

  private productsService = inject(ProductsService);
  private carritoService = inject(CarritoService);
  private platformId = inject(PLATFORM_ID);

  productos = signal<Product[]>([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.productsService.getProductos().subscribe({
        next: (data) => {
          this.productos.set(data);
          console.log('Productos:', this.productos());
        },
        error: (err) => console.error('Error:', err),
      });
    }
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }
}