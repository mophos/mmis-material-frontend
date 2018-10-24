import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { GenericDrugDosagesService } from '../generic-drug-dosages.service';
import { AlertService } from '../alert.service';
import * as _ from 'lodash';
import { LoadingComponent } from 'app/loading/loading.component';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-generic-drug-dosages',
  templateUrl: './generic-drug-dosages.component.html',
  styleUrls: ['./generic-drug-dosages.component.css']
})
export class GenericDrugDosagesComponent implements OnInit {

  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  dosages: any = [];
  dosageId: string;
  dosageName: string;

  opened = false;
  isUpdate = false;
  loading = false;

  jwtHelper: JwtHelper = new JwtHelper();
  menuDelete = false;
  btnDelete = false;
  constructor(
    private drugDosageService: GenericDrugDosagesService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    const accessRight = decoded.accessRight.split(',');
    this.menuDelete = _.indexOf(accessRight, 'MM_DELETED') === -1 ? false : true;
  }

  ngOnInit() {
    this.getList();
  }

  addNew() {
    this.dosageId = null;
    this.dosageName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.getList();
  }

  getList() {
    this.loading = true;
    this.drugDosageService.all(this.btnDelete)
      .then((results: any) => {
        if (results.ok) {
          this.dosages = results.rows;
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

  setisActive(active: any, dosage_id: any) {
    const status = active.target.checked ? 'Y' : 'N';
    this.loadingModal.show();
    this.drugDosageService.isActive(dosage_id, status)
      .then((result: any) => {
        if (result.ok) {
          this.alertService.success();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.loadingModal.hide();
      })
      .catch(() => {
        this.loadingModal.hide();
        this.alertService.serverError();
      });
  }

  edit(p: any) {
    this.dosageId = p.dosage_id;
    this.dosageName = p.dosage_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.dosage_name + ']')
      .then(() => {
        this.drugDosageService.remove(p.dosage_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.dosages, { 'dosage_id': p.dosage_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.dosages[idx].is_deleted = 'Y';
                } else {
                  this.dosages.splice(idx, 1);
                }
              }
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  returnRemove(p: any) {
    this.alertService.confirm('ต้องการยกเลิกการลบ ใช่หรือไม่? [' + p.dosage_name + ']')
      .then(() => {
        this.drugDosageService.returnRemove(p.dosage_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.dosages, { 'dosage_id': p.dosage_id });
              if (idx > -1) {
                this.dosages[idx].is_deleted = 'N';
              }
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
    if (this.dosageName) {
      let promise;
      if (this.isUpdate) {
        promise = this.drugDosageService.update(this.dosageId, this.dosageName);
      } else {
        promise = this.drugDosageService.save(this.dosageName);
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
