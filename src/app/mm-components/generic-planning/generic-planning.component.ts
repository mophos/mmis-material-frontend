import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UomService } from './../uom.service';
import { AlertService } from './../../admin/alert.service';
import { CompleterService, CompleterData, RemoteData } from 'ag2-completer';
import { GenericPlanningService } from './../generic-planning.service';
import * as _ from 'lodash';
import { LoadingComponent } from 'app/loading/loading.component';

@Component({
  selector: 'wm-generic-planning',
  templateUrl: './generic-planning.component.html',
  styleUrls: ['./generic-planning.component.css']
})
export class GenericPlanningComponent implements OnInit {
  @Input('genericId') public genericId: any;
  @ViewChild('inputFocus') public inputFocus: any;
  @ViewChild('loadingModal') loadingModal: LoadingComponent;

  warehouses = [];
  mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  warehouseDataService: any;
  warehouseSourcingDataService: any;

  warehouseName: any;
  sourceWarehouseName: any;
  warehouseId: any;
  sourceWarehouseId: any;

  minQty = 0;
  maxQty = 0;

  minModifier = 0;
  maxModifier = 0;
  requisitionQuotaQty = 0;

  plannings = [];
  isUpdate = false;
  isActive = false;
  saving = false;
  genericPlanningId = null;

  primaryUnitId = null;
  primaryUnitName = null;

  constructor(
    private alertService: AlertService,
    private genericPlanningService: GenericPlanningService,
    private uomService: UomService,
    private completerService: CompleterService
  ) { }

  ngOnInit() {
    this.getWarehouses();
    this.getPlannings();
    this.getProductPrimaryUnit();
  }

  async getWarehouses() {
    this.loadingModal.show();
    try {
      const resp = await this.genericPlanningService.getWarehouses();
      this.loadingModal.hide();
      if (resp.ok) {
        this.warehouses = resp.rows;
        this.warehouseDataService = this.completerService.local(this.warehouses, 'warehouse_name', 'warehouse_name');
        this.warehouseSourcingDataService = this.completerService.local(this.warehouses, 'warehouse_name', 'warehouse_name');
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getProductPrimaryUnit() {
    this.loadingModal.show();
    try {
      const resp = await this.uomService.getPrimaryUnit(this.genericId);
      this.loadingModal.hide();
      if (resp.ok) {
        this.primaryUnitId = resp.unitId;
        this.primaryUnitName = resp.unitName;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getPlannings() {
    this.loadingModal.show();
    try {
      this.plannings = [];
      const resp = await this.genericPlanningService.getPlanning(this.genericId);
      this.loadingModal.hide();
      if (resp.ok) {
        this.plannings = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.originalObject ? event.originalObject.warehouse_id : null;
  }

  setSelectedWarehouseSourcing(event) {
    this.sourceWarehouseId = event.originalObject ? event.originalObject.warehouse_id : null;
  }

  clearSelectedWarehouse() {
    this.warehouseId = null;
  }

  clearSelectedWarehouseSourcing() {
    this.sourceWarehouseId = null;
  }

  resetForm() {
    this.warehouseId = null;
    this.warehouseName = null;
    this.isUpdate = false;
    this.minQty = 0;
    this.maxQty = 0;
    this.minModifier = 0;
    this.maxModifier = 0;
    this.requisitionQuotaQty = 0;
    this.isActive = true;

    this.sourceWarehouseName = null;
    this.sourceWarehouseId = null;

    this.plannings.forEach(v => {
      v.is_update = 'N';
    });
  }

  async savePlaning() {
    const _isActive = this.isActive ? 'Y' : 'N';
    try {
      this.loadingModal.show();
      this.saving = true;
      if (this.warehouseId === this.sourceWarehouseId) {
        this.alertService.error('คลังสินค้าหลัก กับ คลังสำหรับเติม/เบิก สินค้าต้องไม่ใช่คลังเดียวกัน');
      } else {
        let resp;
        if (this.isUpdate) {
          resp = await this.genericPlanningService.updatePlanning(
            this.genericPlanningId,
            this.minQty, this.maxQty, this.minModifier,
            _isActive, this.sourceWarehouseId, this.primaryUnitId, this.requisitionQuotaQty);
        } else {
          resp = await this.genericPlanningService.savePlanning(
            this.warehouseId, this.genericId,
            this.minQty, this.maxQty, this.minModifier, _isActive, this.sourceWarehouseId, this.primaryUnitId, this.requisitionQuotaQty);
        }

        this.loadingModal.hide();
        if (resp.ok) {
          this.alertService.success();
          this.resetForm();
          this.getPlannings();
        } else {
          this.alertService.error(resp.error);
        }
      }
      this.saving = false;
    } catch (error) {
      this.saving = false;
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  doEdit(planning: any) {
    this.plannings.forEach(v => {
      if (v.generic_planning_id === planning.generic_planning_id) {
        v.is_update = 'Y';
      } else {
        v.is_update = 'N';
      }
    });

    this.warehouseId = planning.warehouse_id;
    this.warehouseName = planning.warehouse_name;
    this.sourceWarehouseName = planning.source_warehouse_name;
    this.sourceWarehouseId = planning.source_warehouse_id;
    this.minQty = +planning.min_qty;
    this.maxQty = +planning.max_qty;
    this.requisitionQuotaQty = +planning.requisition_quota_qty;
    this.minModifier = +planning.min_modifier_qty;
    // this.maxModifier = +planning.max_modifier_qty;
    this.genericPlanningId = planning.generic_planning_id;
    this.isActive = planning.is_active === 'Y' ? true : false;
    this.isUpdate = true;
    this.inputFocus.nativeElement.focus();
  }

  doRemove(planing: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ [คลัง: ' + planing.warehouse_name + '] ?')
      .then(async () => {
        this.loadingModal.show();
        try {
          let rs: any = await this.genericPlanningService.removePlanning(planing.generic_planning_id);
          this.loadingModal.hide();
          if (rs.ok) {
            this.getPlannings();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.loadingModal.hide();
          this.alertService.error(JSON.stringify(error))
        }
      }).catch(() => { 
        this.loadingModal.hide();
      });
  }

}
