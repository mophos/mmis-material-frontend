import { AlertService } from './../../alert.service';
import { UnitsService } from './../units.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'wm-units-main',
  templateUrl: './units-main.component.html',
  styleUrls: ['./units-main.component.css']
})
export class UnitsMainComponent implements OnInit {
  loading = false;
  isSaving = false;
  units = [];
  cloneUnits = [];
  opened = false;
  isFocus = false;
  isNew = false;

  @ViewChild('inputUnitCode') private inputUnitCode: any;
  @ViewChild('myGridDetail') private myGridDetail: any;

  unitCode: string;
  unitName: string;
  unitEng: string;
  unitId: any;
  isActive = false;
  isPrimary = false;

  isUpdate = false;
  query: any;
  constructor(
    private unitService: UnitsService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getList();
  }

  async addNew() {
    this.opened = true;
  }

  async getList() {
    try {
      this.loading = true;
      this.units = [];
      const resp = await this.unitService.all();
      if (resp.ok) {
        this.units = resp.rows;
        this.cloneUnits = _.clone(resp.rows);
        this.ref.detectChanges();
      } else {
        this.alertService.error(resp.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  _clearForm() {
    this.isActive = false;
    this.isPrimary = false;
    this.unitCode = null;
    this.unitName = null;
    this.isUpdate = false;
    this.opened = false;
  }

  async save() {
    try {
      this.loading = true;
      const _isActive = this.isActive ? 'Y' : 'N';
      const _isPrimary = this.isPrimary ? 'Y' : 'N';

      let resp;
      if (this.isUpdate) {
        resp = await this.unitService.update(this.unitId, this.unitCode, this.unitName, _isActive, _isPrimary);
      } else {
        resp = await this.unitService.save(this.unitCode, this.unitName, _isActive, _isPrimary);
      }

      if (resp.ok) {
        this.alertService.success();
        this.getList();
        this._clearForm();
      } else {
        this.alertService.error(resp.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  remove(unit: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.unitService.remove(unit.unit_id)
          .then((resp: any) => {
            if (resp.ok) {
              this.alertService.success();
              this.getList();
            } else {
              this.alertService.error(resp.error);
            }
          })
          .catch((error: any) => {
            this.alertService.error(error.message);
          });
      });
  }

  setEditable(unitId: any) {
    this.inputUnitCode.nativeElement.focus();
    this.units.forEach(v => {
      if (v.unit_id === unitId) {
        v.is_edit = 'Y';
        this.unitName = v.unit_name;
        this.unitId = v.unit_id;
        this.unitCode = v.unit_code;
        this.isActive = v.is_active === 'Y' ? true : false;
        this.isPrimary = v.is_primary === 'Y' ? true : false;
        this.isUpdate = true;
      } else {
        v.is_edit = 'N';
      }
    });
  }

  cancelEdit() {
    this._clearForm();

    this.units.forEach(v => {
      v.is_edit = 'N';
    });
  }

  changeUnitCode(idx, unitCode) {
    this.units[idx].unit_code = unitCode;
  }

  changeUnitName(idx, unitName) {
    this.units[idx].unit_name = unitName;
  }

  changeUnitEng(idx, unitEng) {
    this.units[idx].unit_eng = unitEng;
  }

  changeIsPrimary(idx, isPrimary) {
    console.log(isPrimary);
    this.units[idx].is_primary = isPrimary ? 'Y' : 'N';
  }

  changeIsActive(idx, isActive) {
    console.log(isActive);
    this.units[idx].is_active = isActive ? 'Y' : 'N';
  }

  async doSaveUpdate(unit: any) {
    console.log(unit);
    try {
      this.isSaving = true;
      const resp = await this.unitService.update(unit.unit_id, unit.unit_code,
        unit.unit_name, unit.is_active, unit.is_primary);
      if (resp.ok) {
        this.alertService.success();
        this.cancelEdit();
      } else {
        this.alertService.error(resp.error);
      }
      this.isSaving = false;
    } catch (error) {
      this.isSaving = false;
      this.alertService.error(error.message);
    }
  }

  async doSaveNew(unit: any) {
    console.log(unit);
    try {
      if (unit.unit_code && unit.unit_name) {
        this.isSaving = true;
        const resp = await this.unitService.save(unit.unit_code,
          unit.unit_name, unit.is_active, unit.is_primary);
        if (resp.ok) {
          this.alertService.success();
          this.cancelEdit();
        } else {
          this.alertService.error(resp.error);
        }
        this.isSaving = false;
      } else {
        this.alertService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      }

    } catch (error) {
      this.isSaving = false;
      this.alertService.error(error.message);
    }
  }
  enterSearch(event) {
    if (event.target.value === '') {
      this.search();
    }
    if (event.keyCode === 13) {
      this.search();
    } else {
      setTimeout(() => {
        this.search();
      }, 550);
    }
  }

  async search() {
    const rs: any = await this.unitService.search(this.query);
    if (rs.ok) {
      this.units = rs.rows;
    }
  }
}
