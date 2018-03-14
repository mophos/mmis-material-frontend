import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PackageService } from '../package.service';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css']
})
export class PackagesComponent implements OnInit {

  opened: boolean = false;
  smallUnit: string;
  largeUnit: string;
  packageId: string;

  smallQty = 0;
  largeQty = 0;

  isUpdate: boolean = false;
  loading: boolean = false;

  packages: any = [];

  constructor(
    private packageService: PackageService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getPackages();
  }

  addNew() {
    this.smallUnit = null;
    this.largeUnit = null;
    this.packageId = null;
    this.smallQty = 1;
    this.largeQty = 1;
    this.isUpdate = false;
    this.opened = true;
  }

  getPackages() {
    this.loading = true;
    this.packageService.all()
      .then((results: any) => {
        if (results.ok) {
          this.packages = results.rows;
          this.ref.detectChanges();
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

  edit(p: any) {
    this.packageId = p.package_id;
    this.largeUnit = p.large_unit;
    this.smallUnit = p.small_unit;
    this.largeQty = +p.large_qty;
    this.smallQty = +p.small_qty;

    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.large_unit + ', ' + p.small_unit + ']')
      .then(() => {
        this.packageService.remove(p.package_id)
          .then((results: any) => {
            if (results.ok) {
              this.getPackages();
              this.alertService.success();
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
    if (this.largeUnit && this.smallUnit && this.smallQty && this.largeQty) {
      let promise;
      if (this.isUpdate) {
        promise = this.packageService.update(this.packageId, this.largeUnit, this.smallUnit, +this.largeQty, +this.smallQty);
      } else {
        promise = this.packageService.save(this.largeUnit, this.smallUnit, +this.largeQty, +this.smallQty);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.opened = false;
          this.getPackages();
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
        .catch(() => {
          this.alertService.serverError();
        });
    }
  }
}
