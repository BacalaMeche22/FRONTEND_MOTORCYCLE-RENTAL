import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbaordComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashbaordComponent;
  let fixture: ComponentFixture<DashbaordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashbaordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
