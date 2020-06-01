import { TestBed } from '@angular/core/testing';

import { CsvDataService } from './csv-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

describe('CsvDataService', () => {
  let service: CsvDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        HttpClientTestingModule
      ],
      providers: [CsvDataService]
    });
    service = TestBed.inject(CsvDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should have getData function', () => {
    const service: CsvDataService = TestBed.get(CsvDataService);
    expect(service.getBillAndCategroies()).toBeTruthy();
  });

});
