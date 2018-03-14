import { UomService } from './../uom.service';
import { OrderModifierService } from './../order-modifier.service';
import { AlertService } from './../../admin/alert.service';
import { Component, OnInit, Input } from '@angular/core';
import { CompleterService, CompleterData, RemoteData } from 'ag2-completer';
import * as _ from 'lodash';

@Component({
  selector: 'wm-order-modifiers',
  templateUrl: './order-modifiers.component.html',
  styleUrls: ['./order-modifiers.component.css']
})
export class OrderModifiersComponent implements OnInit {
  
  @Input('productId') public productId: any;
  warehouses = [];
  mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  warehouseDataService: any;

  warehouseName: any;
  warehouseId: any;

  minQty = 0;
  maxQty = 0;

  plannings = [];
  isUpdate = false;
  isActive = false;
  saving = false;
  productMinmaxId = null;

  constructor(
    private alertService: AlertService,
    private orderModifierService: OrderModifierService,
    private uomService: UomService,
    private completerService: CompleterService
  ) { }

  ngOnInit() {
    this.getWarehouses();
    this.getMinMaxProducts();
  }

  async getWarehouses() {
    try {
      const resp = await this.orderModifierService.getWarehouses();
      if (resp.ok) {
        this.warehouses = resp.rows;
        this.warehouseDataService = this.completerService.local(this.warehouses, 'warehouse_name', 'warehouse_name');
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error(error.message);
    }
  }

  async getMinMaxProducts() {
    try {
      this.plannings = [];
      const resp = await this.orderModifierService.getMinMaxProducts(this.productId);
      if (resp.ok) {
        this.plannings = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error(error.message);
    }
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.originalObject ? event.originalObject.warehouse_id : null;
  }

  clearSelectedWarehouse() {
    this.warehouseId = null;
  }

  resetForm() {
    this.warehouseId = null;
    this.warehouseName = null;
    this.isUpdate = false;
    this.minQty = 0;
    this.maxQty = 0;
    this.isActive = true;

    this.plannings.forEach(v => {
      v.is_update = 'N';
    });
  }

  async saveMinMax() {
    const _isActive = this.isActive ? 'Y' : 'N';
    try {
      this.saving = true;
      let resp;
      if (this.isUpdate) {
        resp = await this.orderModifierService.updateMinMax(
          this.productMinmaxId,
          this.minQty, this.maxQty, _isActive);
      } else {
        resp = await this.orderModifierService.saveMinMax(
          this.warehouseId, this.productId,
          this.minQty, this.maxQty, _isActive);
      }
      if (resp.ok) {
        this.alertService.success();
        this.resetForm();
        this.getMinMaxProducts();
      } else {
        this.alertService.error(resp.error);
      }
      this.saving = false;
    } catch (error) {
      this.saving = false;
      this.alertService.error(error.message);
    }
  }

  doEdit(planing: any) {
    this.plannings.forEach(v => {
      if (v.product_order_modifier_id === planing.product_order_modifier_id) {
        v.is_update = 'Y';
      } else {
        v.is_update = 'N';
      }
    });

    this.warehouseId = planing.warehouse_id;
    this.warehouseName = planing.warehouse_name;
    this.minQty = planing.min_qty;
    this.maxQty = planing.max_qty;
    this.productMinmaxId = planing.product_order_modifier_id;
    this.isActive = planing.is_active === 'Y' ? true : false;
    this.isUpdate = true;
  }

  doRemove(planing: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ [คลัง: ' + planing.warehouse_name + '] ?')
      .then(() => {
        this.orderModifierService.removeMinMaxProducts(planing.product_order_modifier_id)
          .then((resp: any) => {
            if (resp.ok) {
              this.getMinMaxProducts();
            } else {
              this.alertService.error(resp.error);
            }
          })
      }).catch(() => { });
  }
}
