import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css'
})
export class HomeSliderComponent implements AfterViewInit {
  
  @ViewChild('carouselExample') carouselRef!: ElementRef;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const bootstrap = (window as any).bootstrap;
      const carouselElement = this.carouselRef.nativeElement;

      if (carouselElement && bootstrap?.Carousel) {
        new bootstrap.Carousel(carouselElement, {
          interval: 3000,
          wrap: true,
          pause: false
        });
      } else {
        console.warn('Bootstrap is not available');
      }
    }
  }
}
