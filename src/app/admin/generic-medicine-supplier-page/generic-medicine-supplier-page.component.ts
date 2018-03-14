import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StandardService } from '../standard.service';
import { GenericSuppliesService } from '../generic-supplies.service';
import { AlertService } from '../alert.service';
import { SweetAlertType } from 'sweetalert2';

import * as moment from 'moment';

@Component({
  selector: 'app-generic-medicine-supplier-page',
  templateUrl: './generic-medicine-supplier-page.component.html',
  styleUrls: ['./generic-medicine-supplier-page.component.css']
})
export class GenericMedicineSupplierPageComponent implements OnInit {

  generics: any = [];
  openNew: boolean = false;
  genericGroups: any = [];
  genericTypes: any = [];

  isError: boolean = false;
  isErrorSaving: boolean = false;
  isSuccess: boolean = false;
  loading: boolean = false;
  errorMessage: string;
  errorMessageSaving: string;

  isSaving: boolean = false;
  isUpdate: boolean = false;

  packageDetail: string;
  groupId: string;
  typeId: string;
  genericName: string;
  genericId: string;
  shortName: string;
  description: string;
  keyword: string;

  constructor(
    private standardService: StandardService,
    private genericService: GenericSuppliesService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getGenericTypes();

    this.all();
  }

  getGenericTypes() {
    this.standardService.getGenericSuppliesTypes()
      .then((results: any) => {
        this.genericTypes = results.rows;
      });
  }

  addNew() {
    this.genericName = null;
    this.shortName = null;
    this.typeId = null;
    this.keyword = null;
    this.genericId = null;

    this.isErrorSaving = false;
    this.isUpdate = false;
    this.openNew = true;
  }

  all() {
    this.loading = true;
    this.genericService.all()
      .then((results: any) => {
        if (results.ok) {
          this.generics = results.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error();
        }
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

  save() {

    if (this.genericName && this.shortName && this.typeId && this.keyword) {

      if (this.isUpdate) {
        // update
        let supplies = {
          genericName: this.genericName,
          shortName: this.shortName,
          typeId: this.typeId,
          keyword: this.keyword
        };
        if (!this.genericId) {
          this.alertService.error('ไม่พบรหัสยาที่ต้องการแก้ไข');
        } else {
          this.genericService.updateGeneric(this.genericId, supplies)
            .then((results: any) => {
              if (results.ok) {
                this.alertService.success();
                this.openNew = false;
                this.all();
              } else {
                this.alertService.error(JSON.stringify(results.error));
              }
            })
            .catch(() => {
              this.alertService.serverError();
            });
        }
      } else {
        // new record
        let supplies = {
          genericId: this.genericId || moment().format('x'),
          genericName: this.genericName,
          shortName: this.shortName,
          typeId: this.typeId,
          keyword: this.keyword
        };

        this.genericService.saveGeneric(supplies)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.openNew = false;
              this.all();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });

      }

    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  editProduct(g: any) {
    this.genericId = g.generic_id;

    this.genericName = g.generic_name;
    this.shortName = g.short_name;
    this.typeId = g.type_id;
    this.keyword = g.keyword;

    this.isUpdate = true;
    this.openNew = true;

    this.isErrorSaving = false;

  }

  removeProduct(g) {
    this.alertService.confirm(`คุณต้องการลบ ${g.generic_name} ใช่หรือไม่?`)
      .then(() => {
        this.genericService.removeGeneric(g.generic_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.openNew = false;
              this.all();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

}
