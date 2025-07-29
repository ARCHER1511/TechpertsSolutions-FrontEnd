import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress.component';
import { CartService } from './Services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavBarComponent,
    FooterComponent,
    CommonModule,
    ScrollProgressComponent
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Teckperts-Solutions';
  _cartService = inject(CartService);

  ngOnInit(): void {
    this._cartService.initializeCartState();
    console.log("hi");
  }
}