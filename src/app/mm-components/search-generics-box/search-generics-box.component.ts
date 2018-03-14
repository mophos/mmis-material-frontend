import { Component, OnInit, Output, Input, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'mm-search-generics-box',
  templateUrl: './search-generics-box.component.html',
  styles: []
})
export class SearchGenericsBoxComponent implements OnInit {

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  _disabled: boolean = false;

  @Input() clearOnChange: boolean = false;

  @Input('selectedName')
  set setSelectedValue(value: any) {
    this.query = value;
  }  

  @Input('disabled')
  set setDisabled(value: boolean) {
    this._disabled = value;
  }

  token: any;
  query: any = null;
  searchGenericUrl: any;
  isSelected = false;

  constructor(
    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    this.searchGenericUrl = `${this.apiUrl}/generics/search-autocomplete?token=${this.token}`;
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
    this.query = event ? event.generic_name : null;
  }

}
