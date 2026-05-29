import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniLeaderboard } from './mini-leaderboard';

describe('MiniLeaderboard', () => {
  let component: MiniLeaderboard;
  let fixture: ComponentFixture<MiniLeaderboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniLeaderboard],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniLeaderboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
