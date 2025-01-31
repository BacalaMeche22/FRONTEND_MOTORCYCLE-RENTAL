import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CATEGORIESComponent } from './categories.component';

describe('CATEGORIESComponent', () => {
  let component: CATEGORIESComponent;
  let fixture: ComponentFixture<CATEGORIESComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CATEGORIESComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CATEGORIESComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
