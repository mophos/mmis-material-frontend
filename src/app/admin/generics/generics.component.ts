import { GenericDrugAccountsService } from './../generic-drug-accounts.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StandardService } from '../standard.service';
import { GenericService } from '../generic.service';

import { AlertService } from '../alert.service';

import * as moment from 'moment';
import * as _ from 'lodash';
import { State } from '@clr/angular';
import { LoadingComponent } from 'app/loading/loading.component';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-generics',
  templateUrl: './generics.component.html',
  styleUrls: []
})
export class GenericsComponent implements OnInit {
  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  @ViewChild('pagination') pagination: any;

  generics: any = [];
  openNew = false;
  genericGroups: any = [];
  genericTypes: any = [];
  genericType: any = [];
  genericDosages: any = [];
  drugAccounts: any = [];

  loading = false;

  query: any;
  isSaving = false;
  isUpdate = false;

  dosageId: string;
  groupId: string;
  typeId: string;
  genericTypeId: string;
  genericName: string;
  workingCode: string;
  expired: number;
  description: string;
  keyword: string;
  drugAccountId: string;

  perPage = 20;
  total = 0;

  types: any = [];
  isSearch = false;
  typeFilterId: any = 'all';

  genericTypeIds: any = [];
  jwtHelper: JwtHelper = new JwtHelper();

  currentPage = 1;
  genericCodeAuto: any;
  constructor(
    private standardService: StandardService,
    private genericService: GenericService,
    private alertService: AlertService,
    private accountService: GenericDrugAccountsService,
    private router: Router
  ) {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    this.genericTypeIds = decoded.generic_type_id ? decoded.generic_type_id.split(',') : [];
    this.genericCodeAuto = decoded.MM_GENERIC_CODE_AUTO === 'Y' ? true : false;
    this.currentPage = +sessionStorage.getItem('genericCurrentPage') ? +sessionStorage.getItem('genericCurrentPage') : 1;
  }

  ngOnInit() {
    this.getGenericGroups();
    this.getGenericTypes();
    this.getGenericDosages();
    this.getAccounts();
    this.getGenericType();
  }

  async searchGeneric() {
    this.loadingModal.show();
    try {
      const type = this.typeFilterId ? this.typeFilterId : this.genericTypeIds;
      const rs: any = await this.genericService.search(this.query, type, this.perPage, 0);
      this.loadingModal.hide();
      if (rs.ok) {
        this.generics = rs.rows;
        this.total = rs.total;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  enterSearch(event: any) {
    if (event.target.value === '') {
      this.searchGeneric();
    }
    if (event.keyCode === 13) {
      this.searchGeneric();
    } else {
      setTimeout(() => {
        this.searchGeneric();
      }, 550);
    }
  }

  async getGenericTypes() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericTypes();
      this.loadingModal.hide();
      if (rs.ok) {
        this.loadingModal.hide();
        // this.genericTypes = rs.rows;
        if (rs.rows.length) {
          rs.rows.forEach(v => {
            this.genericTypeIds.forEach(x => {
              if (+x === +v.generic_type_id) {
                this.genericTypes.push(v);
              }
            });
          });

          // this.typeFilterId = sessionStorage.getItem('genericGroupId') ? sessionStorage.getItem('genericGroupId') : this.genericTypeIds;
          if (this.typeFilterId === 'all') {
            sessionStorage.setItem('genericGroupId', JSON.stringify(this.genericTypeIds));
          } else {
            sessionStorage.setItem('genericGroupId', JSON.stringify(this.typeFilterId));
          }
        }
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getAccounts() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericAccount();
      this.loadingModal.hide();
      if (rs.ok) {
        this.loadingModal.hide();
        this.drugAccounts = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getGenericGroups() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericGroups();
      this.loadingModal.hide();
      if (rs.ok) {
        this.loadingModal.hide();
        this.genericGroups = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getGenericDosages() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericDosages();
      this.loadingModal.hide();
      if (rs.ok) {
        this.loadingModal.hide();
        this.genericDosages = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  addNew() {
    this.workingCode = null;
    this.genericName = null;
    this.typeId = null;
    this.genericTypeId = null;
    this.expired = 270;
    this.groupId = null;
    this.dosageId = null;
    this.drugAccountId = null;
    this.openNew = true;
  }

  async getListByTypes() {
    try {
      if (this.query) {
        this.searchGeneric();
      } else {
        this.loadingModal.show();
        let results: any;
        if (this.typeFilterId === 'all') {
          results = await  this.genericService.getListByTypes(this.genericTypeIds, this.perPage, 0);
          sessionStorage.setItem('genericGroupId', JSON.stringify(this.genericTypeIds));
        } else {
          results = await  this.genericService.getListByTypes(this.typeFilterId, this.perPage, 0);
          sessionStorage.setItem('genericGroupId', JSON.stringify(this.typeFilterId));
        }
        console.log( JSON.parse(sessionStorage.getItem('genericGroupId')));
        
        this.loadingModal.hide();
        if (results.ok) {
          this.generics = results.rows;
          this.total = +results.total;
          this.currentPage = 1;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async save() {

    if (!this.genericCodeAuto && this.workingCode.length !== 7) {
      this.alertService.error('กรุณาระบุ Generic Code 7หลัก');
      return;
    }
    if (this.genericName && this.typeId) {
      this.loadingModal.show();
      this.isSaving = true;
      const drugs = {
        genericName: this.genericName,
        typeId: this.typeId,
        genericTypeId: this.genericTypeId,
        groupId: this.groupId,
        dosageId: this.dosageId,
        drugAccountId: this.drugAccountId,
        workingCode: this.workingCode
      };

      try {
        const rs: any = await this.genericService.saveGeneric(drugs)
        // const rs2: any = await this.genericService.saveExpiredAlert(this.expired)
        this.loadingModal.hide();
        if (rs.ok) {
          this.router.navigate(['/admin/generics/edit', rs.generic_id]);
          await this.genericService.saveExpiredAlert(rs.generic_id, this.expired)
          console.log(rs.generic_id)
        } else {
          this.alertService.error(rs.error);
        }
        this.isSaving = false;
      } catch (error) {
        this.loadingModal.hide();
        this.isSaving = false;
        this.alertService.error(JSON.stringify(error));
      }
    } else {
      this.loadingModal.hide();
      this.isSaving = false;
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  async markDeleted(g) {
    const msg = `คุณต้องการลบ ${g.generic_name} ใช่หรือไม่?`;

    this.alertService.confirm(msg)
      .then(async () => {
        try {
          const rs: any = await this.genericService.removeGeneric(g.generic_id);
          if (rs.ok) {
            this.alertService.success();
            const idx = _.findIndex(this.generics, { generic_id: g.generic_id });
            if (idx > -1) {
              this.generics.splice(idx, 1);
            }
          } else {
            this.alertService.error(JSON.stringify(rs.error));
          }
        } catch (error) {
          this.alertService.error(JSON.stringify(error));
        }
      })
      .catch(() => {
        this.loadingModal.hide();
      });
  }

  async refresh(state: State) {

    const limit = +state.page.size;
    const offset = +state.page.from;

    if (!this.currentPage) {
      this.currentPage = this.pagination.currentPage;
    } else {
      this.currentPage = this.currentPage > this.pagination.lastPage ? this.pagination.currentPage : this.pagination.currentPage;
    }

    sessionStorage.setItem('genericCurrentPage', this.pagination.currentPage);

    const _groupId = sessionStorage.getItem('genericGroupId') ? JSON.parse(sessionStorage.getItem('genericGroupId')) : this.genericTypeIds;
    console.log(_groupId);
    
    this.loadingModal.show();
    if (this.isSearch) {
      const results: any = await this.genericService.search(this.query, _groupId, limit, offset);
      this.loadingModal.hide();
      if (results.ok) {
        this.generics = results.rows;
        this.total = results.total;
      } else {
        this.alertService.error(JSON.stringify(results.error));
      }
    } else {
      try {
        const results: any = await this.genericService.getListByTypes(_groupId, limit, offset);
        this.loadingModal.hide();
        if (results.ok) {
          this.generics = results.rows;
          this.total = +results.total;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      } catch (error) {
        this.loadingModal.hide();
        this.alertService.error(JSON.stringify(error));
      }
    }
  }

  async getGenericType() {
    this.genericService.getGenericType()
      .then((results) => {
        if (results.ok) {
          this.genericType = results.rows;
        } else {
          this.alertService.error(JSON.stringify(results.error))
        }
      })
      .catch((error) => {
        this.loadingModal.hide();
        this.alertService.error(JSON.stringify(error));
      })
  }

}
