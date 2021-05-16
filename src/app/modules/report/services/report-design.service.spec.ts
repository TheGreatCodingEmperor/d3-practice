import { TestBed } from '@angular/core/testing';

import { ReportDesignService } from './report-design.service';

describe('ReportDesignService', () => {
  let service: ReportDesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportDesignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
