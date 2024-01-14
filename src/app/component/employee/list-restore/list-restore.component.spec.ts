import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRestoreComponent } from './list-restore.component';

describe('ListRestoreComponent', () => {
  let component: ListRestoreComponent;
  let fixture: ComponentFixture<ListRestoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRestoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
