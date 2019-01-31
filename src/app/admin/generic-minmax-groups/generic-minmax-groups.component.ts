import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericMinmaxGroupsService } from '../generic-minmax-groups.service';
import { AlertService } from '../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from "lodash";

@Component({
  selector: 'wm-generic-minmax-groups',
  templateUrl: './generic-minmax-groups.component.html',
  styleUrls: ['./generic-minmax-groups.component.css']
})
export class GenericMinmaxGroupsComponent implements OnInit {


  accounts: any = [];
  minMaxGroupId: string;
  minMaxGroupName: string = '';

  opened = false;
  isUpdate = false;
  loading = false;
  jwtHelper: JwtHelper = new JwtHelper();
  menuDelete = false;
  btnDelete = false;

  minMaxGroupCal = 0;
  maxSafety= 0;
  minSafety= 0;
  dis: boolean;

  constructor(
    private genericMinmaxGroupsService: GenericMinmaxGroupsService,
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
    this.minMaxGroupId = null;
    this.minMaxGroupName = null;
    this.minMaxGroupCal= null;
    this.maxSafety= null;
    this.minSafety= null;
    this.isUpdate = false;
    this.opened = true;
  }

  getList() {
    this.loading = true;
    this.genericMinmaxGroupsService.all(this.btnDelete)
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
      const resp: any = await this.genericMinmaxGroupsService.returnDelete(productId);
      if (resp.ok) {
        const idx = _.findIndex(this.accounts, { 'group_id': productId })
        this.accounts[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
  edit(p: any) {
    this.minMaxGroupId = p.group_id;
    this.minMaxGroupName = p.group_name;
    this.minMaxGroupCal = p.used_day;
    this.minSafety = p.safety_min_day;
    this.maxSafety = p.safety_max_day;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.group_name + ']')
      .then(() => {
        this.genericMinmaxGroupsService.remove(p.group_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              const idx = _.findIndex(this.accounts, { 'group_id': p.group_id });
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
    if (this.minMaxGroupName) {
      let promise;
      if (this.isUpdate) {
        promise = this.genericMinmaxGroupsService.update(this.minMaxGroupId, this.minMaxGroupName, this.minMaxGroupCal , this.maxSafety ,this.minSafety);
      } else {
        promise = this.genericMinmaxGroupsService.save(this.minMaxGroupName, this.minMaxGroupCal , this.maxSafety ,this.minSafety);
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
  async checkName(){
    this.dis =  await _.trim(this.minMaxGroupName) == ''
  }
}
