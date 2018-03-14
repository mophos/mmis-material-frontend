import { AlertService } from './../../admin/alert.service';
import { UomService } from './../uom.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CompleterService, CompleterData, RemoteData } from 'ag2-completer';
import * as _ from 'lodash';
import { LoadingComponent } from 'app/loading/loading.component';

@Component({
  selector: 'wm-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.css']
})
export class UomComponent implements OnInit {
  @ViewChild('toUnit') toUnit: any;
  @ViewChild('fromUnit') fromUnit: any;
  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  
  @Input('genericId') genericId: any;
  
  cost = 0;

  units = [];
  unitsPrimary = [];
  dataServiceUomActive;
  dataServiceUomPrimary;
  conversionQty = 0;
  fromUnitName = null;
  fromUnitId = null;
  isActive = true;
  isUpdate = false;
  unitgenericId = null;

  primaryUnitId = null;
  primaryUnitName = null;

  conversions = [];

  isSaving = false;

  constructor(
    private uomService: UomService,
    private alertService: AlertService,
    private completerService: CompleterService,
  ) { }

  ngOnInit() {
    this.getActiveUnits();
    this.getPrimaryUnits();
    this.getConversionList();
    this.getProductPrimaryUnit();
  }

  async getActiveUnits() {
    this.loadingModal.show();
    try {
      const resp = await this.uomService.getActiveUnits();
      this.loadingModal.hide();
      if (resp.ok) {
        this.units = resp.rows;
        this.dataServiceUomActive = this.completerService.local(this.units, 'unit_name', 'unit_name');
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getPrimaryUnits() {
    this.loadingModal.show();
    try {
      const resp = await this.uomService.getPrimaryUnits();
      this.loadingModal.hide();
      if (resp.ok) {
        this.unitsPrimary = resp.rows;
        this.dataServiceUomPrimary = this.completerService.local(this.unitsPrimary, 'unit_name', 'unit_name');
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

  async getConversionList() {
    this.loadingModal.show();
    try {
      const resp = await this.uomService.getConversionList(this.genericId);
      this.loadingModal.hide();
      if (resp.ok) {
        this.conversions = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  setSelectedLarge(event) {
    this.fromUnitId = event ? event.originalObject.unit_id : null;
  }

  clearSelectedLarge() {
    this.fromUnitId = null;
  }

  async saveConversion() {
    const _isActive = this.isActive ? 'Y' : 'N';
    let resp: any;
    this.loadingModal.show();
    this.isSaving = true;
    try {
      if (this.isUpdate) {
        resp = await this.uomService.updateConversion(
          this.unitgenericId, this.genericId, this.fromUnitId, this.primaryUnitId, this.conversionQty, _isActive, this.cost);
      } else {
        resp = await this.uomService.saveConversion(
          this.genericId, this.fromUnitId, this.primaryUnitId,
          this.conversionQty, _isActive, this.cost);
      }

      this.loadingModal.hide();
      if (resp.ok) {
        this.alertService.success();
        this.getConversionList();
        this.resetForm();
      } else {
        this.alertService.error(resp.error);
      }
      this.isSaving = false;
    } catch (error) {
      this.loadingModal.hide();
      this.isSaving = false;
      this.alertService.error(JSON.stringify(error));
    }
  }

  resetForm() {
    this.fromUnitId = null;
    this.fromUnitName = null;
    this.isActive = true;
    this.conversionQty = 0;
    this.cost = 0;
    this.unitgenericId = null;
    this.isUpdate = false;
    this.getConversionList();
  }

  doEdit(unit: any) {
    // console.log(unit);
    this.conversions.forEach(v => {
      if (v.unit_generic_id === unit.unit_generic_id) {
        v.is_update = 'Y';
      } else {
        v.is_update = 'N';
      }
    });
    this.fromUnitId = unit.from_unit_id;
    this.fromUnitName = unit.from_unit_name;
    this.conversionQty = unit.qty;
    this.cost = unit.cost;
    this.isActive = unit.is_active === 'Y' ? true : false;
    this.isUpdate = true;
    this.unitgenericId = unit.unit_generic_id;
    this.fromUnit.focus();
  }

  doRemove(unit: any) {
    this.alertService.confirm('ต้องการลบรายการนี้?')
      .then(async () => {
        this.loadingModal.show();
        try {
          let rs: any = await this.uomService.removeConversion(unit.unit_generic_id);
          this.loadingModal.hide();
          if (rs.ok) {
            this.alertService.success();
            this.getConversionList();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.alertService.error(JSON.stringify(error));
        }
      }).catch(() => { 
        this.loadingModal.hide();
      });
  }
}
