import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprogramComponent } from './addprogram.component';

describe('AddprogramComponent', () => {
  let component: AddprogramComponent;
  let fixture: ComponentFixture<AddprogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddprogramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddprogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
