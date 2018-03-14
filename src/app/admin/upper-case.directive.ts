import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[wmUpperCase]'
})
export class UpperCaseDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keyup') onKeyUp() {
    console.log('some thing key upped')
    this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  }
  
}
