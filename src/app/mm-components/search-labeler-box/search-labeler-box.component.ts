import { Component, OnInit, Output, Input, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'mm-search-labeler-box',
  templateUrl: './search-labeler-box.component.html',
  styles: []
})
export class SearchLabelerBoxComponent implements OnInit {

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  _disabled: boolean = false;

  @Input() labelerType: any = 'M'; // M = Manufacturer, V = Vendor

  @Input() clearOnChange: boolean = false;

  @Input('selectedName')
  set setSelectedValue(value: any) {
    this.query = value;
  }  
  
  @Input('disabled')
  set setDisabled(value: boolean) {
    this._disabled = value;
  }

  isSelected = false;
  token: any;
  query: any = null;
  searchGenericUrl: any;

  constructor(
    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    if (this.labelerType === 'M') {
      this.searchGenericUrl = `${this.apiUrl}/labelers/search-autocomplete?type=M&token=${this.token}`;
    } else {
      this.searchGenericUrl = `${this.apiUrl}/labelers/search-autocomplete?type=V&token=${this.token}`;
    }
  }

  ngOnInit() {
  }

  clearSearch() {
    this.query = null;
  }

  clearData(event: any) {
    if (this.clearOnChange) {
      if (!this.isSelected) {
        this.onChange.emit(true);
      } else {
        this.onChange.emit(false);
        this.isSelected = false;
      }
    } else {
      this.onChange.emit(false);
    }
  }

  handleResultSelected(event: any) {
    this.isSelected = true;
    this.onChange.emit(false);
    this.onSelect.emit(event);
    this.query = event ? event.labeler_name : null;
  }

}
