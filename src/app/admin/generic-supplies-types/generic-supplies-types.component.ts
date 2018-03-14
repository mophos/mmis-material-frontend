import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericSuppliesTypesService } from '../generic-supplies-types.service';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-generic-supplies-types',
  templateUrl: './generic-supplies-types.component.html',
  styleUrls: ['./generic-supplies-types.component.css']
})
export class GenericSuppliesTypesComponent implements OnInit {

types: any = [];
  typeId: string;
  typeName: string;

  opened: boolean = false;

  isUpdate: boolean = false;
  loading: boolean = false;

  constructor(
    private genericSuppliesTypeService: GenericSuppliesTypesService,
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
    this.genericSuppliesTypeService.all()
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
    this.typeId = p.type_id;
    this.typeName = p.type_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm(`ต้องการลบ ใช่หรือไม่? [${p.type_name}]`)
      .then(() => {
        this.genericSuppliesTypeService.remove(p.type_id)
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
        promise = this.genericSuppliesTypeService.update(this.typeId, this.typeName);
      } else {
        promise = this.genericSuppliesTypeService.save(this.typeName);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.opened = false;
          this.getList();
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
