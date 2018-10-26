import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericTypesProductService } from '../generic-type-product.service';
import { AlertService } from '../alert.service';
import * as _ from 'lodash'
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'wm-generic-type-product',
  templateUrl: './generic-type-product.component.html',
  styleUrls: ['./generic-type-product.component.css']
})
export class GenericTypeProductComponent implements OnInit {
  types: any = [];
  typeId: string;
  typeName: string;
  prefixName: string;
  opened = false;
  isUpdate = false;
  loading = false;
  btnDelete = false;
  menuDelete = false;
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    private typeProduct: GenericTypesProductService,
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
    this.prefixName = null;
    this.typeId = null;
    this.typeName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  getList() {
    this.loading = true;
    this.typeProduct.all(this.btnDelete)
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
    console.log(p);

    this.typeId = p.generic_type_id;
    this.typeName = p.generic_type_name;
    this.prefixName = p.prefix_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.generic_type_name + ']')
      .then(() => {
        this.typeProduct.remove(p.generic_type_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              const idx = _.findIndex(this.types, { 'generic_type_id': p.generic_type_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.types[idx].is_deleted = 'Y';
                } else {
                  this.types.splice(idx, 1);
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
    if (this.typeName) {
      let promise;
      if (this.isUpdate) {
        promise = this.typeProduct.update(this.typeId, this.typeName, this.prefixName);
      } else {
        promise = this.typeProduct.save(this.typeName, this.prefixName);
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

  checkPrefix() {
    if (this.prefixName.length > 1) {
      this.prefixName = this.prefixName[this.prefixName.length - 1].toUpperCase();
    } else if (this.prefixName.length) {
      this.prefixName = this.prefixName[0].toUpperCase();
    }
  }

  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.getList();
  }
  async returnDelete(productId) {
    try {
      const resp: any = await this.typeProduct.returnDelete(productId);
      if (resp.ok) {
        const idx = _.findIndex(this.types, { 'generic_type_id': productId })
        this.types[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
}
