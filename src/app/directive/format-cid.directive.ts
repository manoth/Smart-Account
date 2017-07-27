import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[FormatCid]'
})
export class FormatCidDirective {

  constructor(private el: ElementRef) { }

  regexStr = '^[0-9]*$';
  @Input() FormatCid: boolean;

  @HostListener('blur', ['$event']) onBlur(event) {
    this.cidFormat();
  }

  @HostListener('keyup', ['$event']) onKeyUp(event) {
    this.cidFormat();
  }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if (this.FormatCid) {
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
          return;
        }
      let ch = (e.key);
      let regEx =  new RegExp(this.regexStr);   
      if(regEx.test(ch))
        return;
      else
         e.preventDefault();
    }
  }

  private cidFormat() {
    let cid = this.el.nativeElement.value.replace(/\D/g, '');
    let formatted = cid;
    if (cid.length > 1) { formatted = cid[0] + '-' + cid.substring(1, 5); }
    if (cid.length > 5) { formatted = cid[0] + '-' + cid.substring(1, 5) + '-' + cid.substring(5, 10); }
    if (cid.length > 10) { formatted = cid[0] + '-' + cid.substring(1, 5) + '-' + cid.substring(5, 10) + '-' + cid.substring(10, 12); }
    if (cid.length > 12) { formatted = cid[0] + '-' + cid.substring(1, 5) + '-' + cid.substring(5, 10) + '-' + cid.substring(10, 12) + '-' + cid[12]; }
    this.el.nativeElement.value = formatted;
  }

}
