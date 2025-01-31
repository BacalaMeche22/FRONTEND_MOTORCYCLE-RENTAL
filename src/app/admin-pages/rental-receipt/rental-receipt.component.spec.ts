import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalReceiptComponent } from './rental-receipt.component';

describe('RentalReceiptComponent', () => {
  let component: RentalReceiptComponent;
  let fixture: ComponentFixture<RentalReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RentalReceiptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
