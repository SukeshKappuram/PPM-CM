import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnReturnComponent } from './grn-return.component';

describe('GrnReturnComponent', () => {
  let component: GrnReturnComponent;
  let fixture: ComponentFixture<GrnReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrnReturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
