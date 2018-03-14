import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wm-unit-editor',
  templateUrl: './unit-editor.component.html',
  styleUrls: ['./unit-editor.component.css']
})
export class UnitEditorComponent implements OnInit, OnDestroy {
  isLoading = false;
  unitName: string;
  unitEng: string;
  isPrimary = false;
  isActive = false;

  @Input() unitId: any;
  @Output() onSave: EventEmitter<any> = new EventEmitter();
  @Output() onExplaned: EventEmitter<any> = new EventEmitter();

  constructor() { 
    console.log('is explaned');
    this.isLoading = true;
    const that = this;
    setTimeout(function() {
      that.isLoading = false;
    }, 1000);
  }

  ngOnInit() {
    this.onExplaned.emit(true);
  }

  ngOnDestroy() {
    console.log('close expland');
    this.onExplaned.emit(false);
  }

  doSave() {
    const obj = {
      unitId: this.unitId,
      unitName: this.unitName,
      unitEng: this.unitEng,
      isPrimary: this.isPrimary,
      isActive: this.isActive
    };
    console.log(obj);
    // this.onSave.emit(obj);
  }

}
