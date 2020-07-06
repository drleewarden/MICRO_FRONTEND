import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestHostMediatorComponent } from './guest-host-mediator.component';

describe('GuestHostMediatorComponent', () => {
  let component: GuestHostMediatorComponent;
  let fixture: ComponentFixture<GuestHostMediatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestHostMediatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestHostMediatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
