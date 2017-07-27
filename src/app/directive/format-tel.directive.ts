import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[FormatTel]'
})
export class FormatTelDirective {

  constructor(private el: ElementRef) { }

  regexStr = '^[0-9]*$';
  @Input() FormatTel: boolean;

  @HostListener('blur', ['$event']) onBlur(event) {
    this.telFormat();
  }

  @HostListener('keyup', ['$event']) onKeyUp(event) {
    this.telFormat();
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (this.FormatTel) {
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
        return;
      }
      let ch = (e.key);
      let regEx = new RegExp(this.regexStr);
      if (regEx.test(ch))
        return;
      else
        e.preventDefault();
    }
  }

  private telFormat() {
    let phone = this.el.nativeElement.value.replace(/\D/g, '');
    let formatted = phone;
    if (phone[0] != 0) { formatted = ''; }
    if (phone.length > 1 && ['06', '08', '09'].indexOf(phone.substring(0, 2)) == -1) { formatted = '0'; }
    if (phone.length > 3) { formatted = phone.substring(0, 3) + '-' + phone.substring(3, 10); }
    this.el.nativeElement.value = formatted;
  }

}
