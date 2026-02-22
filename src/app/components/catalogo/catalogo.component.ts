import { Component, Signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

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
  private readonly platformId = inject(PLATFORM_ID);

  readonly products: Signal<Product[]> = toSignal(
    isPlatformBrowser(this.platformId)
      ? this.productsService.getAll()
      : of([]),
    { initialValue: [] }
  );
}