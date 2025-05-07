import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShedListComponent } from './shed-list.component';

describe('ShedListComponent', () => {
  let component: ShedListComponent;
  let fixture: ComponentFixture<ShedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShedListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
