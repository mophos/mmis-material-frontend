import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericDrugAccountsService } from '../generic-drug-accounts.service';
import { AlertService } from '../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from "lodash";
@Component({
  selector: 'wm-generic-drug-accounts',
  templateUrl: './generic-drug-accounts.component.html',
  styleUrls: ['./generic-drug-accounts.component.css']
})
export class GenericDrugAccountsComponent implements OnInit {


  accounts: any = [];
  drugAccountId: string;
  drugAccountName: string;

  opened = false;
  isUpdate = false;
  loading = false;
  jwtHelper: JwtHelper = new JwtHelper();
  menuDelete = false;
  btnDelete = false;

  constructor(
    private drugAccountService: GenericDrugAccountsService,
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
    this.drugAccountId = null;
    this.drugAccountName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  getList() {
    this.loading = true;
    this.drugAccountService.all(this.btnDelete)
      .then((results: any) => {
        if (results.ok) {
          this.accounts = results.rows;
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
  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.getList();
  }
  async returnDelete(productId) {
    try {
      const resp: any = await this.drugAccountService.returnDelete(productId);
      if (resp.ok) {
        const idx = _.findIndex(this.accounts, { 'id': productId })
        this.accounts[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
  edit(p: any) {
    this.drugAccountId = p.id;
    this.drugAccountName = p.name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.name + ']')
      .then(() => {
        this.drugAccountService.remove(p.id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              const idx = _.findIndex(this.accounts, { 'id': p.id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.accounts[idx].is_deleted = 'Y';
                } else {
                  this.accounts.splice(idx, 1);
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

  save() {
    if (this.drugAccountName) {
      let promise;
      if (this.isUpdate) {
        promise = this.drugAccountService.update(this.drugAccountId, this.drugAccountName);
      } else {
        promise = this.drugAccountService.save(this.drugAccountName);
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
