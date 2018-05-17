import { GenericDrugAccountsService } from './../generic-drug-accounts.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { StandardService } from '../standard.service';
import { GenericService } from '../generic.service';

import { AlertService } from "../alert.service";

import * as moment from 'moment';

@Component({
  selector: 'app-generic-medicine-page',
  templateUrl: './generic-medicine-page.component.html',
  styleUrls: ['./generic-medicine-page.component.css']
})
export class GenericMedicinePageComponent implements OnInit {
  generics: any = [];
  openNew: boolean = false;
  genericGroups: any = [];
  genericTypes: any = [];
  genericDosages: any = [];
  drugAccounts: any = [];

  loading: boolean = false;

  isSaving: boolean = false;
  isUpdate: boolean = false;

  dosageId: string;
  groupId: string;
  typeId: string;
  genericName: string;
  genericId: string;
  shortName: string;
  description: string;
  keyword: string;
  drugAccountId: string;

  constructor(
    private standardService: StandardService,
    private genericService: GenericService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private accountService: GenericDrugAccountsService
  ) { }

  ngOnInit() {
    this.getGenericGroups();
    this.getGenericTypes();
    this.getGenericDosages();
    this.getAccounts();
    this.all();
  }

  getGenericTypes() {
    this.standardService.getGenericTypes()
      .then((results: any) => {
        this.genericTypes = results.rows;
      });
  }

  getAccounts() {
    this.accountService.all()
      .then((results: any) => {
        this.drugAccounts = results.rows;
      });
  }

  getGenericGroups() {
    this.standardService.getGenericGroups1()//แก้
      .then((results: any) => {
        this.genericGroups = results.rows;
      });
  }

  getGenericDosages() {
    this.standardService.getGenericDosages()
      .then((results: any) => {
        this.genericDosages = results.rows;
      });
  }

  addNew() {
    this.genericId = null;
    this.genericName = null;
    this.shortName = null;
    this.typeId = null;
    this.groupId = null;
    this.dosageId = null;
    this.description = null;
    this.keyword = null;
    this.openNew = true;
    this.drugAccountId = null;
  }

  all() {
    // this.loading = true;
    // this.genericService.all()
    //   .then((results: any) => {
    //     if (results.ok) {
    //       this.generics = results.rows;
    //       this.ref.detectChanges();
    //     } else {
    //       this.alertService.error(JSON.stringify(results.error));
    //     }
    //     this.loading = false;
    //   })
    //   .catch(error => {
    //     this.loading = false;
    //     this.alertService.serverError();
    //   })
  }

  save() {

    if (this.genericName && this.shortName
      && this.typeId && this.groupId && this.dosageId && this.description && this.keyword) {

      if (this.isUpdate) {
        // update
        let drugs = {
          genericName: this.genericName,
          shortName: this.shortName,
          typeId: this.typeId,
          groupId: this.groupId,
          dosageId: this.dosageId,
          description: this.description,
          keyword: this.keyword,
          drugAccountId: this.drugAccountId
        };
        if (!this.genericId) {
          alert('ไม่พบรหัสยาที่ต้องการแก้ไข');
        } else {
          this.genericService.updateGeneric(this.genericId, drugs)
            .then((results: any) => {
              if (results.ok) {
                this.openNew = false;
                this.alertService.success();
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
        let drugs = {
          genericId: this.genericId || moment().format('x'),
          genericName: this.genericName,
          shortName: this.shortName,
          typeId: this.typeId,
          groupId: this.groupId,
          dosageId: this.dosageId,
          description: this.description,
          keyword: this.keyword,
          drugAccountId: this.drugAccountId
        };

        this.genericService.saveGeneric(drugs)
          .then((results: any) => {
            if (results.ok) {
              this.openNew = false;
              this.alertService.success();
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
    this.groupId = g.group_id;
    this.dosageId = g.dosage_id;
    this.description = g.description;
    this.keyword = g.keyword;
    this.drugAccountId = g.drug_account_id;

    this.isUpdate = true;
    this.openNew = true;
  }

  removeProduct(g) {
    const msg = `คุณต้องการลบ ${g.generic_name} ใช่หรือไม่?`;

    this.alertService.confirm(msg)
      .then(() => {
        this.genericService.removeGeneric(g.generic_id)
          .then((results: any) => {
            if (results.ok) {
              this.openNew = false;
              this.alertService.success();
              this.all();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      })
      .catch(() => { });
  }

}
