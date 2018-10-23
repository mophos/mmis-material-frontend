import { ProductGroupsService } from './../product-groups.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styles: []
})
export class ProductGroupsComponent implements OnInit {

  productGroups: any = [];
  productGroupId: string;
  productGroupName: string;

  opened = false;
  isUpdate = false;
  loading = false;

  jwtHelper: JwtHelper = new JwtHelper();
  menuDelete = false;
  btnDelete = false;
  constructor(
    private productGroupsService: ProductGroupsService,
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
    this.productGroupId = null;
    this.productGroupName = null;
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
      const rs: any = await this.productGroupsService.list(this.btnDelete);
      if (rs.ok) {
        this.productGroups = rs.rows;
        this.loading = false;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  edit(p: any) {
    this.productGroupId = p.product_group_id;
    this.productGroupName = p.product_group_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.product_group_name + ']')
      .then(() => {
        this.productGroupsService.remove(p.product_group_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.productGroups, { 'product_group_id': p.product_group_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.productGroups[idx].is_deleted = 'Y';
                } else {
                  this.productGroups.splice(idx, 1);
                }
                this.alertService.success();
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


  returnDelete(p: any) {
    this.alertService.confirm('ต้องการยกเลิกการลบ ใช่หรือไม่? [' + p.product_group_name + ']')
      .then(() => {
        this.productGroupsService.return(p.product_group_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.productGroups, { 'product_group_id': p.product_group_id });
              if (idx > -1) {
                this.productGroups[idx].is_deleted = 'N';
                this.alertService.success();
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
    if (this.productGroupName) {
      let promise;
      if (this.isUpdate) {
        promise = this.productGroupsService.update(this.productGroupId, this.productGroupName);
      } else {
        promise = this.productGroupsService.save(this.productGroupName);
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
