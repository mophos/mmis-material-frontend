import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wm-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export class WarehousesComponent implements OnInit {
  loading = false;
  warehouses = [];
  isNewRow = true;

  constructor() { }

  ngOnInit() {
  }

}
