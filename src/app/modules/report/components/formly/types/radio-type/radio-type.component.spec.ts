import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioTypeComponent } from './radio-type.component';

describe('RadioTypeComponent', () => {
  let component: RadioTypeComponent;
  let fixture: ComponentFixture<RadioTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
