import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlocklistComponent } from './add-blocklist.component';

describe('AddBlocklistComponent', () => {
  let component: AddBlocklistComponent;
  let fixture: ComponentFixture<AddBlocklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBlocklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBlocklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
