import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';

export const routes: Routes = 
[
    {path: '', component : CatalogoComponent},
    {path: '**', redirectTo:""}
];