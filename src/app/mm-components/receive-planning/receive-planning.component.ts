import { StandardService } from './../../admin/standard.service';
import { AlertService } from './../../admin/alert.service';
import { ReceivePlanningService } from './../receive-planning.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'wm-receive-planning',
  templateUrl: './receive-planning.component.html',
  styles: []
})
export class ReceivePlanningComponent implements OnInit {

  @Input('genericId') public genericId: any;
  @ViewChild('inputFocus') public inputFocus: any;
  warehouses = [];
  warehouseAll = [];
  warehouseId = '';

  constructor(
    private receivePlanningService: ReceivePlanningService,
    private alertService: AlertService,
    private standardService: StandardService
  ) { }

  ngOnInit() {
    this.getWarehouses();
    this.getList();
    console.log('init', this.genericId);

  }

  async getList() {
    try {
      const rs: any = await this.receivePlanningService.getWarehouse(this.genericId);
      console.log(rs);
      if (rs.ok) {
        this.warehouses = rs.rows;
      } else {
        console.log(rs.error);

      }
    } catch (error) {
      console.log(error);
      this.alertService.error(error);
    }
  }
  async getWarehouses() {
    try {
      const rs: any = await this.standardService.getWarehouses();
      if (rs.ok) {
        this.warehouseAll = rs.rows;
      }
    } catch (error) {
      console.log(error);
      this.alertService.error(JSON.stringify(error));
    }
  }
  async save() {
    try {
      const rs: any = await this.receivePlanningService.save(this.genericId, this.warehouseId);
      if (rs.ok) {
        this.warehouseId = '';
        this.getList();
        this.alertService.success();
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }
  async remove(w) {
    try {
      this.alertService.confirm()
        .then(async (result) => {
          const rs: any = await this.receivePlanningService.remove(w.generic_id, w.warehouse_id);
          if (rs.ok) {
            this.getList();
            this.alertService.success();
          } else {
            this.alertService.error(rs.error);
          }
        }).catch((err) => {

        });
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }
}
