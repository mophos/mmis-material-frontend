import { Component, OnInit, Inject, Output, Input, EventEmitter } from '@angular/core';
@Component({
  selector: 'wm-search-tmt-code',
  templateUrl: './search-tmt-code.component.html',
  styles: []
})
export class SearchTmtCodeComponent implements OnInit {

  @Input('tmtId')
  set setTmtId(value: any) {
    this.query = value;
  }
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  token: any;
  query: any = null;
  searchProductTMTUrl: any;
  tmt_id: any;

  constructor(

    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    this.searchProductTMTUrl = `${this.apiUrl}/mappings/search/tmt-code?token=${this.token}`;
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
