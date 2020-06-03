import { TextPipe } from './text.pipe';
import { fakeAsync } from '@angular/core/testing';

describe('TextPipe', () => {
  let pipe = new TextPipe();

  it('create an instance',  fakeAsync(() => {
    const pipe = new TextPipe();
    expect(pipe).toBeTruthy();
  }));

  it('transforms "type",0 to "支出"', () => {
    expect(pipe.transform(0, 'type')).toBe('支出');
  });
  it('transforms "type",1 to "收入"', () => {
    expect(pipe.transform(1, 'type')).toBe('收入');
  });

  it('transforms "time" to "ISO"', () => {
    expect(pipe.transform(1561910400000, 'time')).toBe('2019-07-01-M00:00:00+08:00');
  });
});
