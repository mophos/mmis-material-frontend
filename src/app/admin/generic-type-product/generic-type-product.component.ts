import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericTypesProductService } from '../generic-type-product.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'wm-generic-type-product',
  templateUrl: './generic-type-product.component.html',
  styleUrls: ['./generic-type-product.component.css']
})
export class GenericTypeProductComponent implements OnInit {
  types: any = [];
  typeId: string;
  typeName: string;

  opened: boolean = false;
  isUpdate: boolean = false;
  loading: boolean = false;

  constructor(
    private typeProduct: GenericTypesProductService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getList();
  }

  addNew() {
    this.typeId = null;
    this.typeName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  getList() {
    this.loading = true;
    this.typeProduct.all()
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
    this.typeId = p.generic_type_id;
    this.typeName = p.generic_type_name;
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
        promise = this.typeProduct.update(this.typeId, this.typeName);
      } else {
        promise = this.typeProduct.save(this.typeName);
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
