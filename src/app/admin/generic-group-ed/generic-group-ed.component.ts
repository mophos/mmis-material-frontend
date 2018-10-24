import { Component, OnInit } from '@angular/core';
import { GenericGroupEDService } from '../generic-group-ed.service';
import { AlertService } from '../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
@Component({
  selector: 'app-generic-group-ed',
  templateUrl: './generic-group-ed.component.html',
  styles: []
})
export class GenericGroupEdComponent implements OnInit {

  genricGroupED: any = [];
  genericGroupEDId: string;
  genericGroupEDName: string;

  opened = false;
  isUpdate = false;
  loading = false;

  jwtHelper: JwtHelper = new JwtHelper();
  menuDelete = false;
  btnDelete = false;
  constructor(
    private genericGroupEDService: GenericGroupEDService,
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
    this.genericGroupEDId = null;
    this.genericGroupEDName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.getList();
  }

  async getList() {
    try {
      this.loading = true;
      const rs: any = await this.genericGroupEDService.list(this.btnDelete);
      if (rs.ok) {
        this.genricGroupED = rs.rows;
        this.loading = false;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  edit(p: any) {
    this.genericGroupEDId = p.ed_id;
    this.genericGroupEDName = p.ed_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.ed_name + ']')
      .then(() => {
        this.genericGroupEDService.remove(p.ed_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.genricGroupED, { 'ed_id': p.ed_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.genricGroupED[idx].is_deleted = 'Y';
                } else {
                  this.genricGroupED.splice(idx, 1);
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

  retunRemove(p: any) {
    this.alertService.confirm('ต้องการยกเลิกการลบ ใช่หรือไม่? [' + p.ed_name + ']')
      .then(() => {
        this.genericGroupEDService.returnRemove(p.ed_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.genricGroupED, { 'ed_id': p.ed_id });
              this.genricGroupED[idx].is_deleted = 'N';
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
    if (this.genericGroupEDName) {
      let promise;
      if (this.isUpdate) {
        promise = this.genericGroupEDService.update(this.genericGroupEDId, this.genericGroupEDName);
      } else {
        promise = this.genericGroupEDService.save(this.genericGroupEDName);
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
