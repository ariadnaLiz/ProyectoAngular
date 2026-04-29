import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { Product } from '../../models/producto.model';
import { ProductsService } from '../../services/productos.service';
import { CarritoService } from '../../services/carrito.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CarritoComponent } from '../carrito/carrito.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent, CarritoComponent],
  providers: [ProductsService, CarritoService],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent implements OnInit {

  private productsService = inject(ProductsService);
  private carritoService = inject(CarritoService);

  productos: Product[] = [];
  inStockCount = computed(() => 
    this.productos.filter(p => p.inStock).length
  );

  products: Product[] = [];
  ngOnInit(): void {
    this.productsService.getProductos().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Productos recibidos:', data);
      },
      error: (err) => console.error('Error al obtener productos:', err),
    });
  }

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
  }
}