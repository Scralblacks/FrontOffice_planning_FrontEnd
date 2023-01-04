import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareManagerComponent } from './share-manager.component';

describe('ShareManagerComponent', () => {
  let component: ShareManagerComponent;
  let fixture: ComponentFixture<ShareManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
