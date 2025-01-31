import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedBookingComponent } from './approved-booking.component';

describe('ApprovedBookingComponent', () => {
  let component: ApprovedBookingComponent;
  let fixture: ComponentFixture<ApprovedBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovedBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
