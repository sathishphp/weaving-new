import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineBrandFormComponent } from './machine-brand-form.component';

describe('MachineBrandFormComponent', () => {
  let component: MachineBrandFormComponent;
  let fixture: ComponentFixture<MachineBrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineBrandFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineBrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
