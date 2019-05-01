import { Component, OnInit, ViewChild } from '@angular/core';
import { GenericService } from '../generic.service';
import { AlertService } from '../alert.service';
import { StandardService } from '../standard.service'
import { Router } from '@angular/router';
import { LoadingComponent } from 'app/loading/loading.component';

@Component({
  selector: 'wm-generic-set-planning',
  templateUrl: './generic-planning.component.html',
  styleUrls: []
})
export class GenericSetPlanningComponent implements OnInit {

  @ViewChild('loadingModal') loadingModal: LoadingComponent
  warehouses: any = [];
  generics: any = [];
  query: any;
  opened: boolean = false;
  warehouseName: any;

  constructor(
    private genricService: GenericService,
    private alertService: AlertService,
    private standardService: StandardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getWarehouses();
  }

  async getWarehouses() {
    this.loadingModal.show();
    try {
      const rs = await this.standardService.getWarehouses();
      if (rs.ok) {
        this.warehouses = rs.rows;
        this.loadingModal.hide();
      }
    } catch (error) {
      this.loadingModal.hide();
      console.log(error);
    }
  }

  async add(warehouse: any) {
    this.generics = [];
    this.opened = true;
    this.warehouseName = warehouse.warehouse_name;
    this.loadingModal.show();
    try {
      const rs = await this.genricService.getGenericPlanning(warehouse.warehouse_id);
      if (rs.ok) {
        this.generics = rs.rows;
      }
      this.loadingModal.hide();
    } catch (error) {
      this.loadingModal.hide();
      console.log(error);
    }
  }

  async searchWarehouses() {
    try {
      const rs: any = await this.standardService.search(this.query);
      if (rs.ok) {
        this.warehouses = rs.rows;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  enterSearch(event: any) {
    if (event.target.value === '') {
      this.searchWarehouses();
    }
    if (event.keyCode === 13) {
      this.searchWarehouses();
    } else {
      setTimeout(() => {
        this.searchWarehouses();
      }, 550);
    }
  }
}
