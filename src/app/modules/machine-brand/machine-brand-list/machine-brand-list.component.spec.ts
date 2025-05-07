import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineBrandListComponent } from './machine-brand-list.component';

describe('MachineBrandListComponent', () => {
  let component: MachineBrandListComponent;
  let fixture: ComponentFixture<MachineBrandListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineBrandListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineBrandListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
