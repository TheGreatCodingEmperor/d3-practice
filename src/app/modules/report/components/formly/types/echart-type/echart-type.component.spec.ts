import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartTypeComponent } from './echart-type.component';

describe('EchartTypeComponent', () => {
  let component: EchartTypeComponent;
  let fixture: ComponentFixture<EchartTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EchartTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
