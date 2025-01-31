import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRentComponent } from './manage-rent.component';

describe('ManageRentComponent', () => {
  let component: ManageRentComponent;
  let fixture: ComponentFixture<ManageRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageRentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
