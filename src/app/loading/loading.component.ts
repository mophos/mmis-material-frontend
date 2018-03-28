import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wm-loading',
  templateUrl: './loading.component.html',
  styles: []
})
export class LoadingComponent implements OnInit {

  opened = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    setTimeout(() => {
      this.opened = true;
    }, 500);
  }

  hide() {
    setTimeout(() => {
      this.opened = false;
    }, 500);
  }


}
