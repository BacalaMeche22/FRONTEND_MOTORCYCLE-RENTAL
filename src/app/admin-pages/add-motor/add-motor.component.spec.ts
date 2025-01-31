import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMotorComponent } from './add-motor.component';

describe('AddMotorComponent', () => {
  let component: AddMotorComponent;
  let fixture: ComponentFixture<AddMotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMotorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
