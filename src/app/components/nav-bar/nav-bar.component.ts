import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Component, HostListener, inject, OnInit, PLATFORM_ID } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../../Services/auth.service";
import { CartService } from "../../Services/cart.service";
import { WishlistService } from "../../Services/wishlist.service";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {
  isLogedIn = false;
  isDarkMode = false;
  scrolled = false;
  logo = 'assets/Images/logo.png';

  cartItemCount$!: Observable<number>;
  cartTotalPrice$!: Observable<number>;
  animateCart$!: Observable<boolean>;
  cartCount = 0;
  cartUpdated = false;

  wishlistItemCount$!: Observable<number>;
  wishlistCount = 0;
  wishlistUpdated = false;

  userName: string | null = null;

  private _platformId = inject(PLATFORM_ID);
  private _isBrowser = isPlatformBrowser(this._platformId);
  public _authService = inject(AuthService);

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Initialize states
    this.cartService.initializeCartState();
    this.wishlistService.initializeWishlistState();
    this._authService.initialize();

    // Initialize theme from localStorage
    if (this._isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
      this.applyTheme();
    }

    // Observables
    this.cartItemCount$ = this.cartService.itemCount$;
    this.cartTotalPrice$ = this.cartService.totalPrice$;
    this.animateCart$ = this.cartService.animateCart$;
    this.wishlistItemCount$ = this.wishlistService.itemCount$;

    if (this._isBrowser) {
      // Auth
      this._authService.isLoggedIn$.subscribe(status => {
        this.isLogedIn = status;
      });

      this._authService.userName$.subscribe(name => {
        this.userName = name;
      });

      // Cart count
      this.cartService.getCart().subscribe(items => {
        const newCount = items.reduce((sum, i) => sum + i.quantity, 0);
        if (newCount !== this.cartCount) {
          this.cartCount = newCount;
          this.triggerCartAnimation();
        }
      });

      // Wishlist count
      this.wishlistService.getLoggedWishList().subscribe(res => {
        const newCount = res.data?.items?.length || 0;
        if (newCount !== this.wishlistCount) {
          this.wishlistCount = newCount;
          this.triggerWishlistAnimation();
        }
      });
    }
  }

  triggerCartAnimation() {
    this.cartUpdated = true;
    setTimeout(() => this.cartUpdated = false, 400);
  }

  triggerWishlistAnimation() {
    this.wishlistUpdated = true;
    setTimeout(() => this.wishlistUpdated = false, 400);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    
    // Save theme preference
    if (this._isBrowser) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  private applyTheme(): void {
    if (this._isBrowser) {
      // Use requestAnimationFrame for smooth transitions
      requestAnimationFrame(() => {
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        document.body.classList.toggle('light-theme', !this.isDarkMode);
        document.body.classList.toggle('dark-theme', this.isDarkMode);
        
        // Add transition class for smooth animation
        document.body.classList.add('theme-transition');
        setTimeout(() => {
          document.body.classList.remove('theme-transition');
        }, 300);
      });
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  get navbarClasses(): Record<string, boolean> {
    return {
      'custom-navbar': true,
      'navbar-scrolled': this.scrolled,
      'dark-mode': this.isDarkMode,
    };
  }

  get linkClass(): string {
    return this.isDarkMode ? 'text-dark' : 'text-white';
  }

  get logoClass(): string {
    return this.isDarkMode ? 'text-dark' : 'text-white';
  }

  get themeIcon(): string {
    return this.isDarkMode ? 'bi-moon-fill' : 'bi-sun-fill';
  }

  logout(): void {
    this._authService.logOut();
  }
}