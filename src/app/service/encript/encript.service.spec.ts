import { TestBed, inject } from '@angular/core/testing';

import { EncriptService } from './encript.service';

describe('EncriptService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncriptService]
    });
  });

  it('should be created', inject([EncriptService], (service: EncriptService) => {
    expect(service).toBeTruthy();
  }));
});
