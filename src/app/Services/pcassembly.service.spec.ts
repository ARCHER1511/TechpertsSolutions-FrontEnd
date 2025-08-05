import { TestBed } from '@angular/core/testing';

import { PCAssemblyService } from './pcassembly.service';

describe('PCAssemblyService', () => {
  let service: PCAssemblyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PCAssemblyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
