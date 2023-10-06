import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterListComponent } from './master-list.component';

describe('AssetsListComponent', () => {
  let component: MasterListComponent;
  let fixture: ComponentFixture<MasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
