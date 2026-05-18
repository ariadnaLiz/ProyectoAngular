import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { DecimalPipe } from '@angular/common';

// En @Component:

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);
  carritoService = inject(CarritoService);
  
  mostrarPreview = false;

  togglePreview() {
    this.mostrarPreview = !this.mostrarPreview;
  }

  irAlCarrito() {
    this.mostrarPreview = false;
    this.router.navigate(['/carrito']);
  }

  irInicio() {
    this.router.navigate(['/']);
  }
}