import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawPage } from './draw-page';

describe('DrawPage', () => {
  let component: DrawPage;
  let fixture: ComponentFixture<DrawPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
