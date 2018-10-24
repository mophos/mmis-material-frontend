import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericDrugTypesService } from '../generic-drug-types.service';
import { AlertService } from '../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash'

@Component({
  selector: 'app-generic-drug-types',
  templateUrl: './generic-drug-types.component.html',
  styleUrls: ['./generic-drug-types.component.css']
})
export class GenericDrugTypesComponent implements OnInit {

  types: any = [];
  typeId: string;
  typeName: string;

  opened: boolean = false;
  isUpdate: boolean = false;
  loading: boolean = false;
  btnDelete: boolean = false;
  menuDelete: boolean = false;
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    private drugTypeService: GenericDrugTypesService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    const accessRight = decoded.accessRight.split(',');
    this.menuDelete = _.indexOf(accessRight, 'MM_DELETED') === -1 ? false : true;
    this.getList();
  }

  addNew() {
    this.typeId = null;
    this.typeName = null;
    this.isUpdate = false;
    this.opened = true;
  }
  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.getList();
  }
  async returnDelete(productId) {
    try {
      const resp: any = await this.drugTypeService.returnDelete(productId);
      if (resp.ok) {
        const idx = _.findIndex(this.types, { 'account_id': productId })
        this.types[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
  getList() {
    this.loading = true;
    const btnD = this.btnDelete ? 'Y' : 'N';
    this.drugTypeService.all(btnD)
      .then((results: any) => {
        if (results.ok) {
          this.types = results.rows;
          this.ref.detectChanges();
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  edit(p: any) {
    this.typeId = p.account_id;
    this.typeName = p.account_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.account_name + ']')
      .then(() => {
        this.drugTypeService.remove(p.account_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.getList();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  save() {
    if (this.typeName) {
      let promise;
      if (this.isUpdate) {
        promise = this.drugTypeService.update(this.typeId, this.typeName);
      } else {
        promise = this.drugTypeService.save(this.typeName);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.opened = false;
          this.getList();
        } else {
          this.alertService.error('ข้อมูลซ้ำ');
          console.log(results.error);
        }
      })
        .catch(() => {
          this.alertService.serverError();
        });
    }
  }
}
