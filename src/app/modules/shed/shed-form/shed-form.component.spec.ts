import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShedFormComponent } from './shed-form.component';

describe('ShedFormComponent', () => {
  let component: ShedFormComponent;
  let fixture: ComponentFixture<ShedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShedFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
