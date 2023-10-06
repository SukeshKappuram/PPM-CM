import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsMasterViewComponent } from './tabs-master-view.component';

describe('TabsMasterViewComponent', () => {
  let component: TabsMasterViewComponent;
  let fixture: ComponentFixture<TabsMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsMasterViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
