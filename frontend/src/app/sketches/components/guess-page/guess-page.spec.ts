import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessPage } from './guess-page';

describe('GuessPage', () => {
  let component: GuessPage;
  let fixture: ComponentFixture<GuessPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GuessPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
