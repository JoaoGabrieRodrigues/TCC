import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamesComponent } from './exames.component';

describe('ExamesComponent', () => {
  let component: ExamesComponent;
  let fixture: ComponentFixture<ExamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExamesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
