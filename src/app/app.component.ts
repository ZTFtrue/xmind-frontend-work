import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CsvDataService } from './csv-data.service';
import { Category } from './model/category';
import { Bill } from './model/bill';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ListDataSource } from './list-data-source';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  // 存储类别,根据类别ID获取类别名称
  categroiesData = {};
  // 存储类别数组
  categroiesFilterData: Category[] = [];
  // 账单数据
  billData: Bill[] = [];
  // 存储过滤数据,生成过滤器
  filterSelect = [];
  // 存储已添加的月份或年
  years: number[] = [];
  months: number[] = [];
  // 过滤类型存储
  filterValues: Bill = { type: -1, time: -1, category: '-1', categoryName: null, amount: null, month: -1, year: -1 };
  // 这个DataSource 是直接复制的MatTableDataSource
  dataSource = new ListDataSource(this.billData);
  // 支出和收入
  ouputMoney = 0;
  inputMoney = 0;
  // 统计显示列表
  statisticBill: Bill[] = [];
  // 要显示的数据
  showBillData: Bill[] = [];

  // 选择全部
  allSelect = -1;

  type = [{ name: '支出', id: 0 }, { name: '收入', id: 1 }];
  // 添加账单form
  form = new FormGroup({
    amountControl: new FormControl('', [
      Validators.required,
    ]),
    dateControl: new FormControl('', [
      Validators.required
    ]),
    typeControl: new FormControl('', [
      Validators.required
    ]),
    categroyControl: new FormControl('', [
      Validators.required
    ])
  });
  // 定义好的排序规则
  orderSort = [{ value: 1, name: '以金额升序' },
  { value: 2, name: '以金额降序' },
  { value: 3, name: '以时间降序' },
  { value: 4, name: '以时间升序' }];
  // 控制显示更多统计信息
  showStatistic = false;
  // 控制显示添加账单页面
  showAddBill = false;

  filteredOptions: Observable<Category[]>;


  @ViewChild('year', { static: true }) yearMatSelectComponent: MatSelect;
  @ViewChild('month', { static: true }) monthMatSelectComponent: MatSelect;
  @ViewChild('order', { static: false }) orderMatSelectComponent: MatSelect;

  constructor(private csvDataService: CsvDataService) {

  }
  ngOnInit(): void {
    this.dataSource.filterPredicate = this.createFilter;
    this.dataSource.connect().subscribe(data => {
      this.showBillData = data;
      this.getMoneyStatistic();
    });
    this.filteredOptions = this.form.get('categroyControl').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  private _filter(value: string): Category[] {
    // TODO
    // 使用form reset 时, 控制台会报错  Cannot read property 'toLowerCase' of null,
    // 可能是 angular bug, 目前不影响使用
    const filterValue = value.toLowerCase();
    return this.categroiesFilterData.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  ngAfterViewInit(): void {
    this.csvDataService.getBillAndCategroies().subscribe(
      res => {
        this.parseDataMessage(res[0], ',');
        this.parseCsv(res[1], ',', true);
        this.filterSelect.push({ id: 'category', name: '账单分类', value: this.categroiesFilterData });
        this.filterSelect.push({ id: 'type', name: '账单类型', value: this.type });
        if (this.years.length > 0) {
          this.yearMatSelectComponent.value = this.years[0];
          this.filterValues.year = this.years[0];
          this.dataSource.filter = JSON.stringify(this.filterValues);
        } else {
          this.monthMatSelectComponent.disabled = true;
          this.monthMatSelectComponent.value = null;
        }
      }
    );
  }
  /**
   * 这个函数可以独立出来, 将CSV数据转化为JS对象数组使用, 如:[{month:'1'},{month:'2'}]
   * 如果用户确实没有提供分割符号, 可以通过常用分割符猜测: 取两行,选择一个常用分割符,判断分割的列是否相等.
   * @param data data
   * @param hasHead is skip first line for data ?
   */
  parseCsv(data: string, strDelimiter: string, hasHead: boolean) {
    const cateCSVRowArrary = data.split('\n');
    strDelimiter = strDelimiter || ',';
    let headDatas = null;
    if (hasHead && cateCSVRowArrary.length >= 1) {
      headDatas = cateCSVRowArrary[0].split(strDelimiter);
      cateCSVRowArrary.splice(0, 1);
    }
    for (const iterator of cateCSVRowArrary) {
      const cateCSVSingleRowArrary = iterator.split(strDelimiter);
      const bill = new Bill();
      for (let i = 0; i < cateCSVSingleRowArrary.length; i++) {
        if (hasHead) {
          // https://basarat.gitbook.io/typescript/type-system/typeguard#type-guard
          // https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer/20779354#20779354
          // https://stackoverflow.com/questions/12467542/how-can-i-check-if-a-string-is-a-float
          if (typeof bill[headDatas[i]] === 'number') {
            const n = cateCSVSingleRowArrary[i];
            if (n.indexOf('.') !== -1) {
              bill[headDatas[i]] = parseFloat(n);
            } else {
              bill[headDatas[i]] = parseInt(n, 10);
            }
          } else {
            bill[headDatas[i]] = cateCSVSingleRowArrary[i];
          }
          // 此处为特殊情况, 如果该函数要作为通用则必须删除下面的判断
          if (headDatas[i] === 'time') {
            const date = new Date(parseInt(cateCSVSingleRowArrary[i], 10));
            bill.month = this.getMonth(date);
            bill.year = this.getYear(date);
          } else if (headDatas[i] === 'category') {
            bill.categoryName = this.categroiesData[cateCSVSingleRowArrary[i]].name;
          }
        } else {
          // 当前项目没有用到该方法, 此处只是作为一个示例
          // arrary.push(cateCSVSingleRowArrary[i])
        }
      }
      this.billData.push(bill);
    }
  }
  /**
   * 此处有两种办法解决, 一种是通过像 parseCsv() 解析, 然后通过遍历获取数据(如显示名称)
   * 另一种如下:
   * @param data data
   * @param strDelimiter what is the csv split character
   */
  parseDataMessage(data: string, strDelimiter: string) {
    const cateCSVRowArrary = data.split('\n');
    // 去掉头
    cateCSVRowArrary.splice(0, 1);
    strDelimiter = strDelimiter || ',';
    for (const iterator of cateCSVRowArrary) {
      const cateCSVSingleRowArrary = iterator.split(strDelimiter);
      this.categroiesData[cateCSVSingleRowArrary[0]] = { name: cateCSVSingleRowArrary[2], type: cateCSVSingleRowArrary[1] };
      const category: Category = {
        id: cateCSVSingleRowArrary[0],
        type: parseInt(cateCSVSingleRowArrary[1], 10), name: cateCSVSingleRowArrary[2]
      };
      this.categroiesFilterData.push(category);
    }
  }
  getMonth(date: Date): number {
    const month = date.getMonth() + 1;
    if (this.months.indexOf(month) < 0) {
      this.months.push(month);
      this.months.sort((a, b) => a - b);
    }
    return month;
  }
  getYear(date: Date): number {
    const year = date.getFullYear();
    if (this.years.indexOf(year) < 0) {
      this.years.push(year);
      this.years.sort((a, b) => a - b);
    }
    return year;
  }
  selectionChange(data: MatSelectChange, filter: string) {
    this.filterValues[filter] = data.value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  selectionYearChange(data: MatSelectChange) {
    this.filterValues.year = data.value;
    if (this.filterValues.year === null) {
      this.monthMatSelectComponent.disabled = true;
      this.monthMatSelectComponent.value = -1;
      this.filterValues.month = -1;
    } else {
      this.monthMatSelectComponent.disabled = false;
      this.monthMatSelectComponent.value = -1;
      this.filterValues.month = -1;
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }
  selectionMonthChange(data: MatSelectChange) {
    this.filterValues.month = data.value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (data.value !== null) {
    }
  }
  // Custom filter method
  createFilter(data: Bill, filter: string): boolean {
    const searchTerms = JSON.parse(filter);
    data = JSON.parse(JSON.stringify(data));
    const isFilterSet: boolean[] = [];
    // 遍历过滤条件
    for (const col in searchTerms) {
      if (searchTerms[col] !== null && String(searchTerms[col]) !== String(-1)) {
        if (String(data[col]) === String(searchTerms[col])) {
          isFilterSet.push(true);
        } else {
          isFilterSet.push(false);
        }
      }
    }
    return isFilterSet.every((item) => {
      // 只要有一个是false, 说明这条数据不符合过滤条件
      return item;
    });
  }
  /**
   * 对选择数据进行统计
   */
  getMoneyStatistic() {
    this.statisticBill = [];
    this.ouputMoney = 0;
    this.inputMoney = 0;
    // 只对月份进行处理
    if (String(this.filterValues.month) === String(this.allSelect) ||
      String(this.filterValues.category) !== String(this.allSelect) ||
      String(this.filterValues.type) !== String(this.allSelect)) {
      return;
    }
    this.ouputMoney = 0;
    this.inputMoney = 0;
    const cData = {};
    for (const iterator of this.showBillData) {
      if (String(iterator.type) === '0') {
        let bill: Bill = cData[iterator.category];
        if (bill) {
          bill.amount = bill.amount + iterator.amount;
        } else {
          bill = {
            amount: iterator.amount,
            category: iterator.category,
            categoryName: iterator.categoryName,
            month: iterator.month,
            time: iterator.time,
            type: iterator.type,
            year: iterator.year,
          };
          cData[iterator.category] = bill;
        }
      }
      if (parseInt(String(iterator.type), 10) === 0) {
        this.ouputMoney = this.ouputMoney + parseFloat(String(iterator.amount));
      } else if (parseInt(String(iterator.type), 10) === 1) {
        this.inputMoney = this.inputMoney + parseFloat(String(iterator.amount));
      }
    }
    for (const bill in cData) {
      if (cData.hasOwnProperty(bill)) {
        this.statisticBill.push(cData[bill]);
      }
    }
    this.statisticBillSortByAmount('amount', false);
  }
  /**
   * 对统计数据进行排序
   * @param attribute 要排序的属性
   * @param descend 是否降序
   */
  statisticBillSortByAmount(attribute: string, descend: boolean) {
    if (descend) {
      this.statisticBill.sort((a, b) => b[attribute] - a[attribute]);
    } else {
      this.statisticBill.sort((a, b) => a[attribute] - b[attribute]);
    }
  }
  selectionOrderChange(event: MatSelectChange) {
    /**
     * { value: 1, name: '以金额升序' },
     * { value: 2, name: '以金额降序' },
     * { value: 3, name: '以时间降序' },
     * { value: 4, name: '以时间升序' }
     */
    switch (event.value) {
      case 1:
        this.statisticBillSortByAmount('amount', false);
        break;
      case 2:
        this.statisticBillSortByAmount('amount', true);
        break;
      case 3:
        this.statisticBillSortByAmount('time', false);
        break;
      case 4:
        this.statisticBillSortByAmount('time', true);
        break;
    }
  }
  addBill() {
    if (this.form.valid) {
      const date = new Date(this.form.value.dateControl);
      const bill = new Bill();
      bill.amount = parseInt(this.form.value.amountControl, 10);
      const categoryName = this.form.value.categroyControl.trim();
      const categroy = this.getCategroyByName(categoryName);
      if (categroy) {
        bill.category = categroy.id;
      } else {
        const id = String(new Date().getTime());
        this.categroiesData[id] = { name: categoryName, type: this.form.value.typeControl };
        const categories: Category = {
          id,
          type: this.form.value.typeControl, name: categoryName
        };
        this.categroiesFilterData.push(categories);
        bill.category = id;
      }
      bill.categoryName = categoryName;
      bill.month = this.getMonth(date);
      bill.time = date.getTime();
      bill.type = this.form.value.typeControl;
      bill.year = this.getYear(date);
      this.billData.push(bill);
      // 重置过滤器
      if (this.yearMatSelectComponent.value !== null) {
        if (this.yearMatSelectComponent.value !== bill.year) {
          this.yearMatSelectComponent.value = bill.year;
          this.filterValues.year = bill.year;
        }
        if (this.monthMatSelectComponent.value !== null && this.monthMatSelectComponent.value !== bill.month) {
          this.monthMatSelectComponent.value = bill.month;
          this.filterValues.month = bill.month;
        }
        this.filterValues.category = '-1';
        this.filterValues.type = -1;
        this.dataSource.filter = JSON.stringify(this.filterValues);

      }
      this.showAddBill = false;
      this.form.reset();
      this.scrollToBottom();
    }
  }
  getCategroyByName(name: string): Category {
    let result = null;
    for (const item of this.categroiesFilterData) {
      if (item.name === name) {
        result = item;
        break;
      }
    }
    return result;
  }
  // 平滑向下滚动
  scrollToBottom() {
    const scrollBottom = () => {
      let y = window.scrollY;
      while (true) {
        window.scrollTo(0, 1000);
        if (window.scrollY === 0 || window.scrollY === y) {
          break;
        }
        window.requestAnimationFrame(scrollBottom);
        y = window.scrollY;
      }
    };
    scrollBottom();
  }
}
