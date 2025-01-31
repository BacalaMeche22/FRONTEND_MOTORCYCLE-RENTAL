import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMotorcycleComponent } from './get-motorcycle.component';

describe('GetMotorcycleComponent', () => {
  let component: GetMotorcycleComponent;
  let fixture: ComponentFixture<GetMotorcycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GetMotorcycleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetMotorcycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
