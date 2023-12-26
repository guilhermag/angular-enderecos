import { TestBed } from '@angular/core/testing';

import { CepCodeService } from './cep-code.service';

describe('CepCodeService', () => {
  let service: CepCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CepCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
