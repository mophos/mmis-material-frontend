import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wm-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {
  drugs: any[] = [];
  constructor() { }

  ngOnInit() {
  }

}
