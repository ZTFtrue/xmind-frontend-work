import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CsvDataService } from './csv-data.service';
import { ListItemViewComponent } from './list-item-view/list-item-view.component';
import { TextPipe } from './text.pipe';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let csvDataService: CsvDataService;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TextPipe,
        ListItemViewComponent
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSelectModule,
        MatInputModule,
        MatListModule,
        MatAutocompleteModule,
        HttpClientTestingModule,
        MatButtonModule,
      ],
      providers: [AppComponent, CsvDataService],
    }).compileComponents().then(() => {

    });
  }));

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
    csvDataService = fixture.componentRef.injector.get(CsvDataService);

  });

  it('#showAddBillView() should toggle showAddBill', async(() => {
    component.showAddBillView();
    fixture.detectChanges();
    expect(component.showAddBill).toBe(true);
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('add-bill-form')).toBeDefined();
    component.showAddBillView();
    fixture.detectChanges();
    expect(component.showAddBill).toBe(false);
  }));
  it('list element should have', async(() => {
    csvDataService.getBillAndCategroies().subscribe(value => {
      expect(value).toBeDefined();
      component.parseDataMessage(value[0], ',');
      component.parseCsv(value[1], ',', true);
      component.filterSelect.push({ id: 'category', name: '账单分类', value: this.categroiesFilterData });
      component.filterSelect.push({ id: 'type', name: '账单类型', value: this.type });
      if (component.years.length > 0) {
        component.yearMatSelectComponent.value = this.years[0];
        component.filterValues.year = this.years[0];
        component.dataSource.filter = JSON.stringify(this.filterValues);
      } else {
        component.monthMatSelectComponent.disabled = true;
        component.monthMatSelectComponent.value = null;
      }
      const element = fixture.debugElement.query(By.css('bill-list-item'));
      expect(element.childNodes.length > 0).toBe(true);
    });
  }));
  // it('should display a different test title', () => {
  //   component.yearMatSelectComponent.value = 2019;
  //   fixture.detectChanges();
  //   expect(h1.textContent).toContain('Test Title');
  // });
  afterEach(() => {
    // clean data
  });
});
