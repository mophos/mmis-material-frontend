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

  modalEdit = false;
  modalLargeUnit: any;
  modalLargeUnitId: any;
  modalConversion: any;
  modalsmallUnit: any;
  modalCost: any;
  modalUnitGenericId: any;
  modalGenericId: any;

  uomReq: any;

  constructor(
    private uomService: UomService,
    private alertService: AlertService,
    private completerService: CompleterService,
  ) { }

  ngOnInit() {
    this.getActiveUnits();
    this.getPrimaryUnits();
    this.getUomReq();
    this.getConversionList();
    this.getProductPrimaryUnit();
  }

  async getUomReq() {
    this.loadingModal.show();
    try {
      const resp = await this.uomService.getUomReq(this.genericId);
      this.loadingModal.hide();
      if (resp.ok) {
        this.uomReq = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
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

  setSelectedLargeModal(event) {
    this.modalLargeUnitId = event ? event.originalObject.unit_id : null;
  }

  clearSelectedLarge() {
    this.fromUnitId = null;
  }

  clearSelectedLargeModal() {
    this.modalLargeUnitId = null;
  }

  async changeStatus(e, c) {
    const idx = _.findIndex(this.conversions, { 'unit_generic_id': c.unit_generic_id });
    if (idx > -1) {
      if (!e.target.checked) {
        this.conversions[idx].is_active = 'N';
      } else {
        this.conversions[idx].is_active = 'Y';
      }
      try {
        this.loadingModal.show();
        const rs = await this.uomService.saveActive(this.conversions[idx].unit_generic_id, this.conversions[idx].is_active);
        if (rs.ok) {
          this.loadingModal.hide();
          this.alertService.success();
        } else {
          this.loadingModal.hide();
          this.alertService.error(rs.error);
        }
      } catch (error) {
        this.loadingModal.hide();
        this.alertService.error(JSON.stringify(error));
      }
    }
  }

  async changeStatusPlanning(e, c) {
    const idx = _.findIndex(this.conversions, { 'unit_generic_id': c.unit_generic_id });
    if (idx > -1) {
      this.conversions.forEach(v => {
        if (v.unit_generic_id !== c.unit_generic_id) {
          v.planning = 'N'
        }
      });
      let unitGenericId;
      if (!e.target.checked) {
        this.conversions[idx].planning = 'N';
        unitGenericId = null;
      } else {
        this.conversions[idx].planning = 'Y';
        unitGenericId = c.unit_generic_id;
      }
      try {
        this.loadingModal.show();
        console.log(this.conversions[idx].generic_id, unitGenericId);

        const rs = await this.uomService.updateConversionPlanning(this.conversions[idx].generic_id, unitGenericId);
        if (rs.ok) {
          this.loadingModal.hide();
          this.alertService.success();
        } else {
          this.loadingModal.hide();
          this.alertService.error(rs.error);
        }
      } catch (error) {
        this.loadingModal.hide();
        this.alertService.error(JSON.stringify(error));
      }
    }
  }

  async changeUseUOM(e, c) {
    try {
      if (!e.target.checked) {
        this.uomReq = null;
      } else {
        this.uomReq = c.unit_generic_id;
      }
      this.loadingModal.show();
      const rs = await this.uomService.updateUomReq(this.uomReq, this.genericId);
      if (rs.ok) {
        this.loadingModal.hide();
        this.alertService.success();
      } else {
        this.loadingModal.hide();
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }


  async saveConversion() {
    // const _isActive = this.isActive ? 'Y' : 'N';
    let resp: any;
    this.loadingModal.show();
    this.isSaving = true;
    try {
      if (this.isUpdate) {
        resp = await this.uomService.updateConversion(
          this.modalGenericId, this.modalUnitGenericId, this.modalLargeUnitId, this.primaryUnitId, this.modalConversion, this.modalCost);
      } else {
        resp = await this.uomService.saveConversion(
          this.genericId, this.fromUnitId, this.primaryUnitId,
          this.conversionQty, 'Y', this.cost);
      }
      this.modalEdit = false;
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
    // this.conversions.forEach(v => {
    //   if (v.unit_generic_id === unit.unit_generic_id) {
    //     v.is_update = 'Y';
    //   } else {
    //     v.is_update = 'N';
    //   }
    // });

    // this.fromUnitId = unit.from_unit_id;
    // this.fromUnitName = unit.from_unit_name;
    // this.conversionQty = unit.qty;
    // this.cost = unit.cost;
    // this.isActive = unit.is_active === 'Y' ? true : false;
    this.isUpdate = true;
    // this.unitgenericId = unit.unit_generic_id;
    this.modalGenericId = this.genericId;
    this.modalUnitGenericId = unit.unit_generic_id;
    this.modalLargeUnit = unit.from_unit_name;
    this.modalLargeUnitId = unit.from_unit_id;
    this.modalConversion = unit.qty;
    this.modalsmallUnit = this.primaryUnitId
    this.modalCost = unit.cost;

    this.modalEdit = true;
    // this.fromUnit.focus();
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
