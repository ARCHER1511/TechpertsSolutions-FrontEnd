import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensionsNetworkingComponent } from './expensions-networking.component';

describe('ExpensionsNetworkingComponent', () => {
  let component: ExpensionsNetworkingComponent;
  let fixture: ComponentFixture<ExpensionsNetworkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensionsNetworkingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpensionsNetworkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
