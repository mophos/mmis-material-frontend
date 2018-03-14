import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericDrugTypesService } from '../generic-drug-types.service';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-generic-drug-types',
  templateUrl: './generic-drug-types.component.html',
  styleUrls: ['./generic-drug-types.component.css']
})
export class GenericDrugTypesComponent implements OnInit {

  types: any = [];
  typeId: string;
  typeName: string;

  opened: boolean = false;
  isUpdate: boolean = false;
  loading: boolean = false;

  constructor(
    private drugTypeService: GenericDrugTypesService,
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
    this.drugTypeService.all()
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
    this.typeId = p.account_id;
    this.typeName = p.account_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.account_name + ']')
      .then(() => {
        this.drugTypeService.remove(p.account_id)
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
        promise = this.drugTypeService.update(this.typeId, this.typeName);
      } else {
        promise = this.drugTypeService.save(this.typeName);
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
