import { Pipe, PipeTransform } from '@angular/core';
import { formatDate, formatCurrency } from '@angular/common';

@Pipe({
  name: 'text'
})
export class TextPipe implements PipeTransform {

  transform(value: any, args: any, categroiesData?: any): string {
    const column = args;
    switch (column) {
      case 'type':
        value = String(value) === '1' ? '收入' : '支出';
        break;
      case 'category':
        value = categroiesData[value].name;
        break;
      case 'time':
        // If you use any other locale than en-US, don't forget to register the locale as described 'zh-Hans'
        value = formatDate(parseInt(value, 10), 'yyyy-MM-dd-EEEEEHH:mm:ssZZZZZ', 'en-US');
        break;
      case 'amount':
        // If you use any other locale than en-US, don't forget to register the locale as described 'zh-Hans'
        value = formatCurrency(parseInt(value, 10), 'zh-Hans', '￥');
        break;
      default:
        break;
    }
    return value;
  }

}
