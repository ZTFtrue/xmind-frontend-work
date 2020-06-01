import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemViewComponent } from './list-item-view.component';

describe('ListItemViewComponent', () => {
  let component: ListItemViewComponent;
  let fixture: ComponentFixture<ListItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
