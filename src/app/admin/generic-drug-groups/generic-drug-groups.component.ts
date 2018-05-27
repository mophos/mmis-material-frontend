import { StandardService } from './../standard.service';
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
  listGroup3: any = [];
  listGroup4: any = [];

  selectGroup2: any = [];
  selectGroup3: any = [];

  groupName1 = '';
  groupName2 = '';

  groupCode1 = '';
  groupCode2 = '';

  openModalGroup1 = false;
  openModalGroup2 = false;
  openModalGroup3 = false;
  openModalGroup4 = false;

  modal1GroupCode1 = '';
  modal1GroupName1 = '';

  modal2GroupCode1 = '';
  modal2GroupName1 = '';
  modal2GroupCode2 = '';
  modal2GroupName2 = '';

  modal3GroupCode1 = '';
  modal3GroupName1 = '';
  modal3GroupCode2 = '';
  modal3GroupName2 = '';
  modal3GroupCode3 = '';
  modal3GroupName3 = '';

  modal4GroupCode1 = '';
  modal4GroupName1 = '';
  modal4GroupCode2 = '';
  modal4GroupName2 = '';
  modal4GroupCode3 = '';
  modal4GroupName3 = '';
  modal4GroupCode4 = '';
  modal4GroupName4 = '';

  isUpdate = false;
  loading = false;

  constructor(
    private drugGroupService: GenericDrugGroupsService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private standardService: StandardService
  ) { }

  ngOnInit() {
    this.getGroup1();
    this.getGroup2();
    this.getGroup3();
    this.getGroup4();
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

  selectGroupName1Modal2(e) {
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
        this.drugGroupService.removeGroup2(p.group_code_1, p.group_code_2)
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
  // ################################################
  // ############## GROUP 3 ######################
  addNewGroup3() {
    this.modal3GroupCode1 = '';
    this.modal3GroupCode2 = '';
    this.modal3GroupCode3 = '';
    this.modal3GroupName1 = '';
    this.modal3GroupName2 = '';
    this.modal3GroupName3 = '';
    this.isUpdate = false;
    this.openModalGroup3 = true;
  }

  selectGroupName1Modal3(e) {
    const idx1 = _.findIndex(this.listGroup1, { 'group_code_1': this.modal3GroupCode1 });
    this.modal3GroupName1 = this.listGroup1[idx1];
    this.getSelectGroup2();
    // if (!this.isUpdate) {
    //   this.modal3GroupCode2 = this.selectGroup2[0].group_code_2;
    // }
  }

  selectGroupName2Modal3(e) {
    const idx2 = _.findIndex(this.selectGroup2, { 'group_code_2': this.modal3GroupCode2 });
    this.modal3GroupName2 = this.selectGroup2[idx2];
  }

  getGroup3() {
    this.loading = true;
    this.drugGroupService.getGenericGroup3('A')
      .then((results: any) => {
        if (results.ok) {
          this.listGroup3 = results.rows;
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  getSelectGroup2() {
    this.loading = true;
    this.standardService.getGenericGroups2(this.modal3GroupCode1)
      .then((results: any) => {
        if (results.ok) {
          this.selectGroup2 = results.rows;
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  setisActiveGroup3(active: any, data: any) {
    const status = active.target.checked ? 'Y' : 'N';
    this.loadingModal.show();
    this.drugGroupService.isActiveGroup3(data.group_code_1, data.group_code_2, data.group_code_3, status)
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

  async editGroup3(p: any) {
    await this.getSelectGroup2();
    this.modal3GroupName1 = p.group_name_1;
    this.modal3GroupName2 = p.group_name_2;
    this.modal3GroupName3 = p.group_name_3;
    this.modal3GroupCode1 = p.group_code_1;
    this.modal3GroupCode2 = p.group_code_2;
    this.modal3GroupCode3 = p.group_code_3;
    this.isUpdate = true;
    this.openModalGroup3 = true;
  }

  removeGroup3(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.group_name_3 + ']')
      .then(() => {
        this.drugGroupService.removeGroup3(p.group_code_1, p.group_code_2, p.group_code_3)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.getGroup3();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  async saveGroup3() {
    try {
      if (this.modal3GroupName3 && this.modal3GroupCode1 && this.modal3GroupCode2 && this.modal3GroupCode3) {
        let results;
        if (this.isUpdate) {
          results = await this.drugGroupService.updateGroup3(this.modal3GroupCode1, this.modal3GroupCode2, this.modal3GroupCode3, this.modal3GroupName3);
        } else {
          results = await this.drugGroupService.saveGroup3(this.modal3GroupCode1, this.modal3GroupCode2, this.modal3GroupCode3, this.modal3GroupName3);
        }
        if (results.ok) {
          this.alertService.success();
          this.openModalGroup3 = false;
          this.getGroup3();
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
  // ############## GROUP 4 ######################
  addNewGroup4() {
    this.modal4GroupCode1 = '';
    this.modal4GroupCode2 = '';
    this.modal4GroupCode3 = '';
    this.modal4GroupCode4 = '';
    this.modal4GroupName1 = '';
    this.modal4GroupName2 = '';
    this.modal4GroupName3 = '';
    this.modal4GroupName4 = '';
    this.isUpdate = false;
    this.openModalGroup4 = true;
  }

  selectGroupName1Modal4(e) {
    const idx = _.findIndex(this.listGroup1, { 'group_code_1': this.modal4GroupCode1 });
    this.modal4GroupName1 = this.listGroup1[idx];
    this.getSelectModal4Group2();
  }

  selectGroupName2Modal4(e) {
    const idx = _.findIndex(this.selectGroup2, { 'group_code_2': this.modal4GroupCode2 });
    this.modal4GroupName2 = this.selectGroup2[idx];
    this.getSelectModal4Group3();
  }


  getGroup4() {
    this.loading = true;
    this.drugGroupService.getGenericGroup4('A')
      .then((results: any) => {
        if (results.ok) {
          this.listGroup4 = results.rows;
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  getSelectModal4Group2() {
    this.loading = true;
    this.standardService.getGenericGroups2(this.modal4GroupCode1)
      .then((results: any) => {
        if (results.ok) {
          this.selectGroup2 = results.rows;
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  getSelectModal4Group3() {
    this.loading = true;
    this.standardService.getGenericGroups3(this.modal4GroupCode1, this.modal4GroupCode2)
      .then((results: any) => {
        if (results.ok) {
          this.selectGroup3 = results.rows;
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  setisActiveGroup4(active: any, data: any) {
    const status = active.target.checked ? 'Y' : 'N';
    this.loadingModal.show();
    this.drugGroupService.isActiveGroup4(data.group_code_1, data.group_code_2, data.group_code_3, data.group_code_4, status)
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

  async editGroup4(p: any) {
    this.modal4GroupName1 = p.group_name_1;
    this.modal4GroupName2 = p.group_name_2;
    this.modal4GroupName3 = p.group_name_3;
    this.modal4GroupName4 = p.group_name_4;
    this.modal4GroupCode1 = p.group_code_1;
    this.modal4GroupCode2 = p.group_code_2;
    this.modal4GroupCode3 = p.group_code_3;
    this.modal4GroupCode4 = p.group_code_4;
    await this.getSelectModal4Group2();
    await this.getSelectModal4Group3();
    this.isUpdate = true;
    this.openModalGroup4 = true;
  }

  removeGroup4(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.group_name_4 + ']')
      .then(() => {
        this.drugGroupService.removeGroup4(p.group_code_1, p.group_code_2, p.group_code_3, p.group_code_4)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.getGroup4();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  async saveGroup4() {
    try {
      if (this.modal4GroupName4 && this.modal4GroupCode1 && this.modal4GroupCode2 && this.modal4GroupCode3 && this.modal4GroupCode4) {
        let results;
        if (this.isUpdate) {
          results = await this.drugGroupService.updateGroup4(this.modal4GroupCode1, this.modal4GroupCode2, this.modal4GroupCode3, this.modal4GroupCode4, this.modal4GroupName4);
        } else {
          results = await this.drugGroupService.saveGroup4(this.modal4GroupCode1, this.modal4GroupCode2, this.modal4GroupCode3, this.modal4GroupCode4, this.modal4GroupName4);
        }
        if (results.ok) {
          this.alertService.success();
          this.openModalGroup4 = false;
          this.getGroup4();
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
