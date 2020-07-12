import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestContainerComponent } from './guest-container.component';

describe('GuestContainerComponent', () => {
  let component: GuestContainerComponent;
  let fixture: ComponentFixture<GuestContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
