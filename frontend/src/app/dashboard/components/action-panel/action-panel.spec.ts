import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPanel } from './action-panel';

describe('ActionPanel', () => {
  let component: ActionPanel;
  let fixture: ComponentFixture<ActionPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
