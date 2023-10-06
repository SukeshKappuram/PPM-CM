import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftLayoutComponent } from './left-layout.component';

describe('LeftLayoutComponent', () => {
  let component: LeftLayoutComponent;
  let fixture: ComponentFixture<LeftLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeftLayoutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LeftLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
