import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawLineComponent } from './draw-line.component';

describe('DrawLineComponent', () => {
  let component: DrawLineComponent;
  let fixture: ComponentFixture<DrawLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
