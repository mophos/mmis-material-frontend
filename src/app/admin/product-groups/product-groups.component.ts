import { ProductGroupsService } from './../product-groups.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert.service';

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

  constructor(
    private productGroupsService: ProductGroupsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getList();
  }

  addNew() {
    this.productGroupId = null;
    this.productGroupName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  async getList() {
    try {
      this.loading = true;
      const rs: any = await this.productGroupsService.list();
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
