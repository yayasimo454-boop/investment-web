import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifiedChart } from './unified-chart';

describe('UnifiedChart', () => {
  let component: UnifiedChart;
  let fixture: ComponentFixture<UnifiedChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnifiedChart],
    }).compileComponents();

    fixture = TestBed.createComponent(UnifiedChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});