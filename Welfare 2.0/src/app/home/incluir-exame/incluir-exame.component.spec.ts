import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncluirExameComponent } from './incluir-exame.component';

describe('IncluirExameComponent', () => {
  let component: IncluirExameComponent;
  let fixture: ComponentFixture<IncluirExameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncluirExameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncluirExameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
