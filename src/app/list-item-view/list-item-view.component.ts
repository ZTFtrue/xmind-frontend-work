import { Component, OnInit, Input } from '@angular/core';
import { Bill } from '../model/bill';

@Component({
  selector: 'app-list-item-view',
  templateUrl: './list-item-view.component.html',
  styleUrls: ['./list-item-view.component.css']
})
export class ListItemViewComponent implements OnInit {
  @Input() showBillData: Bill[];
  constructor() { }

  ngOnInit(): void {
  }

}
