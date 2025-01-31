import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorReportComponent } from './motor-report.component';

describe('MotorReportComponent', () => {
  let component: MotorReportComponent;
  let fixture: ComponentFixture<MotorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MotorReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
