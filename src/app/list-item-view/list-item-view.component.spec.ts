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
  // it('show list', () => {
  //   const hero: Hero = { id: 42, name: 'Test' };
  //   comp.hero = hero;

  //   comp.selected.subscribe((selectedHero: Hero) => expect(selectedHero).toBe(hero));
  //   comp.click();
  // });
});
