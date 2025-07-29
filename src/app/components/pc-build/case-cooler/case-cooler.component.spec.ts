import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseCoolerComponent } from './case-cooler.component';

describe('CaseCoolerComponent', () => {
  let component: CaseCoolerComponent;
  let fixture: ComponentFixture<CaseCoolerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseCoolerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseCoolerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
