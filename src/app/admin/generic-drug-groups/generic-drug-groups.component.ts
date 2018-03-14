import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericDrugGroupsService } from '../generic-drug-groups.service';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-generic-drug-groups',
  templateUrl: './generic-drug-groups.component.html',
  styleUrls: ['./generic-drug-groups.component.css']
})
export class GenericDrugGroupsComponent implements OnInit {

  groups: any = [];
  groupId: string;
  groupName: string;

  opened: boolean = false;
  isUpdate: boolean = false;
  loading: boolean = false;

  constructor(
    private drugGroupService: GenericDrugGroupsService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getList();
  }

  addNew() {
    this.groupId = null;
    this.groupName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  getList() {
    this.loading = true;
    this.drugGroupService.all()
      .then((results: any) => {
        if (results.ok) {
          this.groups = results.rows;
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
    this.groupId = p.group_id;
    this.groupName = p.group_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.group_name + ']')
      .then(() => {
            this.drugGroupService.remove(p.group_id)
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
    if (this.groupName) {
      let promise;
      if (this.isUpdate) {
        promise = this.drugGroupService.update(this.groupId, this.groupName);
      } else {
        promise = this.drugGroupService.save(this.groupName);
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
