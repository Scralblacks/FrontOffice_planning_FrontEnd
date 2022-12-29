import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBoxComponent } from './day-box.component';

describe('DayBoxComponent', () => {
  let component: DayBoxComponent;
  let fixture: ComponentFixture<DayBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
