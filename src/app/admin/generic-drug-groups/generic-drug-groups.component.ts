import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { GenericDrugGroupsService } from '../generic-drug-groups.service';
import { AlertService } from '../alert.service';
import { LoadingComponent } from 'app/loading/loading.component';
import * as _ from 'lodash';
@Component({
  selector: 'app-generic-drug-groups',
  templateUrl: './generic-drug-groups.component.html',
  styleUrls: ['./generic-drug-groups.component.css']
})
export class GenericDrugGroupsComponent implements OnInit {

  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  listGroup1: any = [];
  listGroup2: any = [];

  groupName1 = '';
  groupName2 = '';

  groupCode1 = '';
  groupCode2 = '';

  openModalGroup1 = false;
  openModalGroup2 = false;

  modal1GroupCode1 = '';
  modal1GroupName1 = '';
  modal2GroupCode1 = '';
  modal2GroupName1 = '';
  modal2GroupCode2 = '';
  modal2GroupName2 = '';

  isUpdate = false;
  loading = false;

  constructor(
    private drugGroupService: GenericDrugGroupsService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getGroup1();
    this.getGroup2();
  }
  // ############## GROUP 1 ######################
  addNewGroup1() {
    this.modal1GroupCode1 = '';
    this.modal1GroupName1 = '';
    this.isUpdate = false;
    this.openModalGroup1 = true;
  }

  getGroup1() {
    this.loading = true;
    this.drugGroupService.getGenericGroup1('A')
      .then((results: any) => {
        if (results.ok) {
          this.listGroup1 = results.rows;
          // this.ref.detectChanges();
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  setisActiveGroup1(active: any, id: any) {
    const status = active.target.checked ? 'Y' : 'N';
    this.loadingModal.show();
    this.drugGroupService.isActiveGroup1(id, status)
      .then((result: any) => {
        if (result.ok) {
          this.alertService.success();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.loadingModal.hide();
      })
      .catch(() => {
        this.loadingModal.hide();
        this.alertService.serverError();
      });
  }

  editGroup1(p: any) {
    this.modal1GroupName1 = p.group_name_1;
    this.modal1GroupCode1 = p.group_code_1;
    this.isUpdate = true;
    this.openModalGroup1 = true;
  }

  removeGroup1(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.group_name_1 + ']')
      .then(() => {
        this.drugGroupService.removeGroup1(p.group_code_1)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.getGroup1();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  async saveGroup1() {
    try {
      if (this.modal1GroupName1) {
        let results;
        if (this.isUpdate) {
          results = await this.drugGroupService.updateGroup1(this.modal1GroupName1, this.modal1GroupCode1);
        } else {
          results = await this.drugGroupService.saveGroup1(this.modal1GroupName1, this.modal1GroupCode1);
        }
        if (results.ok) {
          this.alertService.success();
          this.openModalGroup1 = false;
          this.getGroup1();
        } else {
          this.alertService.error('ข้อมูลซ้ำ');
          console.log(results.error);
        }
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }
  // ################################################
  // ############## GROUP 2 ######################
  addNewGroup2() {
    this.modal2GroupCode1 = '';
    this.modal2GroupCode2 = '';
    this.modal2GroupName1 = '';
    this.modal2GroupName2 = '';
    this.isUpdate = false;
    this.openModalGroup2 = true;
  }

  selectGroupName1Modal2(e, modal2GroupName1) {
    // this.modal2GroupCode1 = e.target.value;
    const idx = _.findIndex(this.listGroup1, { 'group_code_1': this.modal2GroupCode1 });
    this.modal2GroupName1 = this.listGroup1[idx];
    console.log(this.modal2GroupCode1);
    
  }
  getGroup2() {
    this.loading = true;
    this.drugGroupService.getGenericGroup2('A')
      .then((results: any) => {
        if (results.ok) {
          this.listGroup2 = results.rows;
          // this.ref.detectChanges();
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  setisActiveGroup2(active: any, data: any) {
    const status = active.target.checked ? 'Y' : 'N';
    this.loadingModal.show();
    this.drugGroupService.isActiveGroup2(data.group_code_1, data.group_code_2, status)
      .then((result: any) => {
        if (result.ok) {
          this.alertService.success();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.loadingModal.hide();
      })
      .catch(() => {
        this.loadingModal.hide();
        this.alertService.serverError();
      });
  }

  editGroup2(p: any) {
    this.modal2GroupName1 = p.group_name_1;
    this.modal2GroupName2 = p.group_name_2;
    this.modal2GroupCode1 = p.group_code_1;
    this.modal2GroupCode2 = p.group_code_2;
    this.isUpdate = true;
    this.openModalGroup2 = true;
  }

  removeGroup2(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.group_name_2 + ']')
      .then(() => {
        this.drugGroupService.removeGroup2(p.group_code_2)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.getGroup2();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  async saveGroup2() {
    console.log(this.modal2GroupCode1);
    try {
      if (this.modal2GroupName2 && this.modal2GroupCode1) {
        let results;
        if (this.isUpdate) {
          results = await this.drugGroupService.updateGroup2(this.modal2GroupCode1, this.modal2GroupCode2, this.modal2GroupName2);
        } else {
          results = await this.drugGroupService.saveGroup2(this.modal2GroupCode1, this.modal2GroupCode2, this.modal2GroupName2);
        }
        if (results.ok) {
          this.alertService.success();
          this.openModalGroup2 = false;
          this.getGroup2();
        } else {
          this.alertService.error('ข้อมูลซ้ำ');
          console.log(results.error);
        }
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }
}
