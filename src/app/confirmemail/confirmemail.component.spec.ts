import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmemailComponent } from './confirmemail.component';

describe('ConfirmemailComponent', () => {
  let component: ConfirmemailComponent;
  let fixture: ComponentFixture<ConfirmemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmemailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
