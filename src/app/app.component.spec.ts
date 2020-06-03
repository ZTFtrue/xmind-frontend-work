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
      fixture = TestBed.createComponent(AppComponent);
      csvDataService = fixture.componentRef.injector.get(CsvDataService);
      component = fixture.componentInstance;
      expect(component).toBeTruthy();
    });
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
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
  it('should get month and year ', () => {
    expect(component.getMonth(new Date(1561910400000))).toEqual(7);
    expect(component.getYear(new Date(1561910400000))).toEqual(2019);
  });
  it('list element should have', async(() => {
    csvDataService.getBillAndCategroies().subscribe(value => {
      expect(value.length === 2).toBeTruthy();
      expect(component.parseDataMessage(value[0], ',')).toBeDefined();
      expect(component.categroiesFilterData.length > 0).toBe(true);
      expect(component.parseCsv(value[1], ',', true)).toBeDefined();
      expect(component.billData.length > 0).toBe(true);
      expect(component.billData[0].month > 0).toBe(true);
      component.filterSelect.push({ id: 'category', name: '账单分类', value: component.categroiesFilterData });
      component.filterSelect.push({ id: 'type', name: '账单类型', value: component.type });
      expect(component.filterSelect.length > 0).toBeTrue();
      expect(component.years.length > 0).toBeTrue();
      component.yearMatSelectComponent.value = component.years[0];
      component.filterValues.year = component.years[0];
      component.dataSource.filter = JSON.stringify(component.filterValues);
      const element = fixture.debugElement.query(By.css('bill-list-item'));
      expect(element.childNodes.length > 0).toBe(true);
    });
  }));

  afterEach(() => {
    // clean data
  });
});
