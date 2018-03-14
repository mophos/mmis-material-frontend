import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericDrugDosagesService } from '../generic-drug-dosages.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-generic-drug-dosages',
  templateUrl: './generic-drug-dosages.component.html',
  styleUrls: ['./generic-drug-dosages.component.css']
})
export class GenericDrugDosagesComponent implements OnInit {

  dosages: any = [];
  dosageId: string;
  dosageName: string;

  opened: boolean = false;
  isUpdate: boolean = false;
  loading: boolean = false;

  constructor(
    private drugDosageService: GenericDrugDosagesService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getList();
  }

  addNew() {
    this.dosageId = null;
    this.dosageName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  getList() {
    this.loading = true;
    this.drugDosageService.all()
      .then((results: any) => {
        if (results.ok) {
          this.dosages = results.rows;
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
    this.dosageId = p.dosage_id;
    this.dosageName = p.dosage_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.dosage_name + ']')
      .then(() => {
            this.drugDosageService.remove(p.dosage_id)
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
    if (this.dosageName) {
      let promise;
      if (this.isUpdate) {
        promise = this.drugDosageService.update(this.dosageId, this.dosageName);
      } else {
        promise = this.drugDosageService.save(this.dosageName);
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
