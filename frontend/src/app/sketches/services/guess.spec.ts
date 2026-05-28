import { TestBed } from '@angular/core/testing';

import { Guess } from './guess';

describe('Guess', () => {
  let service: Guess;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Guess);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
