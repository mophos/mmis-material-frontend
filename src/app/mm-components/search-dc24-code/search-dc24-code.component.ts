import { Component, OnInit, Inject, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'wm-search-dc24-code',
  templateUrl: './search-dc24-code.component.html',
  styleUrls: ['./search-dc24-code.component.css']
})
export class SearchDc24CodeComponent implements OnInit {

  @Input('dcId')
  set setDCId(value: any) {
    this.query = value;
  }
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  token: any;
  query: any = null;
  searchProductDCUrl: any;
  dc_id: any;

  constructor(

    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    this.searchProductDCUrl = `${this.apiUrl}/mappings/search/dc24-code?token=${this.token}`;
  }

  ngOnInit() {
  }

  clearProductSearch() {
    this.query = null;
  }

  clearSelected(event: any) {
    if (event) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        this.onChange.emit(false);
      } else {
        this.onChange.emit(true);
      }
    } else {
      this.onChange.emit(false);
    }
  }

  handleResultSelected(event: any) {
    this.onSelect.emit(event);
    this.query = event.tmtid;
    this.onChange.emit(event);
  }

  set(id: any) {
    this.query = id;
  }

}
