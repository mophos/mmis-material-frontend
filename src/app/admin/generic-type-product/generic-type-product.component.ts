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
  modalLV1GenericTypeLV1Id: any;
  modalLV1GenericTypeLV1Name: any;

  modalLV2GenericTypeLV1Id: any;
  modalLV2GenericTypeLV2Id: any;
  modalLV2GenericTypeLV2Name: any;

  modalLV3GenericTypeLV1Id: any;
  modalLV3GenericTypeLV2Id: any;
  modalLV3GenericTypeLV3Id: any;
  modalLV3GenericTypeLV3Name: any;
  modalLV3GenericTypeLV2 = [];


  genericTypeLV1Id: any;
  genericTypeLV1Name: any;
  genericTypeLV2Id: any;
  genericTypeLV2Name: any;
  genericTypeLV3Id: any;
  genericTypeLV3Name: any;
  genericTypeLV1 = [];
  genericTypeLV2 = [];
  genericTypeLV3 = [];
  typeId: string;
  typeName: string;
  prefixName: string;
  openModalLV1 = false;
  openModalLV2 = false;
  openModalLV3 = false;
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
    this.getGenericTypeLV1();
    this.getGenericTypeLV2();
    this.getGenericTypeLV3();
  }

  addNewLV1() {
    this.prefixName = null;
    this.modalLV1GenericTypeLV1Id = null;
    this.modalLV1GenericTypeLV1Name = null;
    this.isUpdate = false;
    this.openModalLV1 = true;
  }
  addNewLV2() {
    this.modalLV2GenericTypeLV1Id = null;
    this.modalLV2GenericTypeLV2Id = null;
    this.modalLV2GenericTypeLV2Name = null;
    this.isUpdate = false;
    this.openModalLV2 = true;
  }
  addNewLV3() {
    this.modalLV3GenericTypeLV1Id = null;
    this.modalLV3GenericTypeLV2Id = null;
    this.modalLV3GenericTypeLV3Id = null;
    this.modalLV3GenericTypeLV3Name = null;
    this.isUpdate = false;
    this.openModalLV3 = true;
  }

  getGenericTypeLV1() {
    this.loading = true;
    this.typeProduct.genericTypeLV1(this.btnDelete)
      .then((results: any) => {
        if (results.ok) {
          this.genericTypeLV1 = results.rows;
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

  getGenericTypeLV2() {
    this.loading = true;
    this.typeProduct.genericTypeLV2(this.btnDelete)
      .then((results: any) => {
        if (results.ok) {
          this.genericTypeLV2 = results.rows;
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

  getGenericTypeLV3() {
    this.loading = true;
    this.typeProduct.genericTypeLV3(this.btnDelete)
      .then((results: any) => {
        if (results.ok) {
          this.genericTypeLV3 = results.rows;
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

  selectGenericTypeLV1Modal3() {
    this.modalLV3GenericTypeLV2 = _.filter(this.genericTypeLV2, { 'generic_type_lv1_id': +this.modalLV3GenericTypeLV1Id });
    this.modalLV3GenericTypeLV2Id = this.modalLV3GenericTypeLV2[0].generic_type_lv2_id;
  }

  editLV1(p: any) {
    this.modalLV1GenericTypeLV1Id = p.generic_type_id;
    this.modalLV1GenericTypeLV1Name = p.generic_type_name;
    this.prefixName = p.prefix_name;
    this.isUpdate = true;
    this.openModalLV1 = true;
  }

  editLV2(p: any) {
    this.modalLV2GenericTypeLV1Id = p.generic_type_lv1_id
    this.modalLV2GenericTypeLV2Id = p.generic_type_lv2_id
    this.modalLV2GenericTypeLV2Name = p.generic_type_lv2_name;
    this.isUpdate = true;
    this.openModalLV2 = true;
  }

  editLV3(p: any) {
    this.modalLV3GenericTypeLV1Id = p.generic_type_lv1_id
    this.modalLV3GenericTypeLV2Id = p.generic_type_lv2_id;
    this.modalLV3GenericTypeLV3Id = p.generic_type_lv3_id;
    this.modalLV3GenericTypeLV3Name = p.generic_type_lv3_name;
    this.isUpdate = true;
    this.openModalLV3 = true;
  }

  removeLV1(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.generic_type_name + ']')
      .then(() => {
        this.typeProduct.removeLV1(p.generic_type_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              const idx = _.findIndex(this.genericTypeLV1, { 'generic_type_id': p.generic_type_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.genericTypeLV1[idx].is_deleted = 'Y';
                } else {
                  this.genericTypeLV1.splice(idx, 1);
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

  removeLV2(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.generic_type_lv2_name + ']')
      .then(() => {
        this.typeProduct.removeLV2(p.generic_type_lv2_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              const idx = _.findIndex(this.genericTypeLV2, { 'generic_type_lv2_id': p.generic_type_lv2_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.genericTypeLV2[idx].is_deleted = 'Y';
                } else {
                  this.genericTypeLV2.splice(idx, 1);
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

  removeLV3(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.generic_type_lv3_name + ']')
      .then(() => {
        this.typeProduct.removeLV3(p.generic_type_lv3_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              const idx = _.findIndex(this.genericTypeLV3, { 'generic_type_lv3_id': p.generic_type_lv3_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.genericTypeLV3[idx].is_deleted = 'Y';
                } else {
                  this.genericTypeLV3.splice(idx, 1);
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

  saveLV1() {
    if (this.modalLV1GenericTypeLV1Name) {
      let promise;
      if (this.isUpdate) {
        promise = this.typeProduct.updateLV1(this.modalLV1GenericTypeLV1Id, this.modalLV1GenericTypeLV1Name, this.prefixName);
      } else {
        promise = this.typeProduct.saveLV1(this.modalLV1GenericTypeLV1Name, this.prefixName);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.openModalLV1 = false;
          this.getGenericTypeLV1();
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

  saveLV2() {
    if (this.modalLV2GenericTypeLV2Name) {
      let promise;
      if (this.isUpdate) {
        promise = this.typeProduct.updateLV2(this.modalLV2GenericTypeLV2Id, this.modalLV2GenericTypeLV2Name, this.modalLV2GenericTypeLV1Id);
      } else {
        promise = this.typeProduct.saveLV2(this.modalLV2GenericTypeLV2Name, this.modalLV2GenericTypeLV1Id);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.openModalLV2 = false;
          this.getGenericTypeLV2();
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

  saveLV3() {
    if (this.modalLV3GenericTypeLV3Name) {
      let promise;
      if (this.isUpdate) {
        promise = this.typeProduct.updateLV3(this.modalLV3GenericTypeLV3Id, this.modalLV3GenericTypeLV3Name, this.modalLV3GenericTypeLV1Id, this.modalLV3GenericTypeLV2Id);
      } else {
        promise = this.typeProduct.saveLV3(this.modalLV3GenericTypeLV3Name, this.modalLV3GenericTypeLV1Id, this.modalLV3GenericTypeLV2Id);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.openModalLV3 = false;
          this.getGenericTypeLV3();
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
    this.getGenericTypeLV1();
    this.getGenericTypeLV2();
    this.getGenericTypeLV3();
  }

  async returnDeleteLV1(genericTypeId) {
    try {
      const resp: any = await this.typeProduct.returnDeleteLV1(genericTypeId);
      if (resp.ok) {
        const idx = _.findIndex(this.genericTypeLV1, { 'generic_type_id': genericTypeId })
        this.genericTypeLV1[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async returnDeleteLV2(genericTypeId) {
    try {
      const resp: any = await this.typeProduct.returnDeleteLV2(genericTypeId);
      if (resp.ok) {
        const idx = _.findIndex(this.genericTypeLV2, { 'generic_type_lv2_id': genericTypeId })
        this.genericTypeLV2[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async returnDeleteLV3(genericTypeId) {
    try {
      const resp: any = await this.typeProduct.returnDeleteLV3(genericTypeId);
      if (resp.ok) {
        const idx = _.findIndex(this.genericTypeLV3, { 'generic_type_lv3_id': genericTypeId })
        this.genericTypeLV3[idx].is_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
}
