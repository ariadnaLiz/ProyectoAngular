import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoFullComponent } from './components/carrito-full/carrito-full.component';
import { SeguimientoComponent } from './components/seguimiento/seguimiento.component';

export const routes: Routes = [
  { path: '', component: CatalogoComponent },
  { path: 'carrito', component: CarritoFullComponent },
  { path: 'seguimiento', component: SeguimientoComponent },
  { path: '**', redirectTo: '' }
];