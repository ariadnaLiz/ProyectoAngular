import { Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductCardComponent } from '../producto/producto.component';
import { ProductsService } from '../../services/productos.service';
import { Product } from '../../models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent {
  private readonly productsService = inject(ProductsService);

  readonly products: Signal<Product[]> = toSignal(
    this.productsService.getAll(),
    { initialValue: [] }
  );
}