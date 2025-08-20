import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigendDeliveriesComponent } from './assigend-deliveries.component';

describe('AssigendDeliveriesComponent', () => {
  let component: AssigendDeliveriesComponent;
  let fixture: ComponentFixture<AssigendDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigendDeliveriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssigendDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
