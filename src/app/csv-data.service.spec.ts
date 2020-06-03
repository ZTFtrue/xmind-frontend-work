import { TestBed } from '@angular/core/testing';

import { CsvDataService } from './csv-data.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
let httpClientSpy: { get: jasmine.Spy };
describe('CsvDataService', () => {
  let service: CsvDataService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
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

  it('#getValue should return arrary', () => {
    service.getBillAndCategroies().subscribe(value => {
      expect(value).toBe('observable value');
    });
  });

});
