import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardService } from 'app/admin/standard.service';
import { GenericService } from 'app/admin/generic.service';
import { AlertService } from 'app/admin/alert.service';
import { GenericDrugAccountsService } from 'app/admin/generic-drug-accounts.service';
import { GenericMinmaxGroupsService } from "./../generic-minmax-groups.service";
import { UomService } from 'app/mm-components/uom.service';
import { LoadingComponent } from 'app/loading/loading.component';
import * as _ from 'lodash';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'wm-generics-edit',
  templateUrl: './generics-edit.component.html',
  styles: []
})
export class GenericsEditComponent implements OnInit {
  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  genericGroups: any = [];
  genericTypes: any = [];
  genericDosages: any = [];
  drugAccounts: any = [];
  typeProduct: any = [];
  conversions: any = [];
  minmaxGroups: any = [];
  ed: any = [];

  isSaving = false;
  loading = false;

  pTypeId: string;
  dosageId: string;
  groupId: string;
  typeId: string;
  typeOldId: string;
  typeFilterId: string;

  edId: any;
  genericName: string;
  unitName: string;
  pName: string;
  genericId: string;
  shortName: string;
  description: string;
  keywords: string;
  drugAccountId: string;
  workingCode: any;
  shortCode: any;
  isActive: any;
  isPlanning: any;
  planningMethod = 1;
  planningUnitGenericId: null;
  minmaxGroupId:any;

  minQty = 0;
  maxQty = 0;
  eoqQty = 0;
  orderingCost = 0;
  carryingCost = 0;

  primaryUnits: any = [];
  primaryUnitId: any;

  bidTypes = [];
  bidTypeId = null;

  isType = false;
  genericGroup1 = [];
  genericGroup2 = [];
  genericGroup3 = [];
  genericGroup4 = [];
  groupId1: any;
  groupId2: any;
  groupId3: any;
  groupId4: any;
  genericTypeIds = [];
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    private genericMinmaxGroupsService: GenericMinmaxGroupsService,
    private standardService: StandardService,
    private genericService: GenericService,
    private alertService: AlertService,
    private accountService: GenericDrugAccountsService,
    private router: ActivatedRoute,
    private uomService: UomService
  ) {
    this.genericId = this.router.snapshot.params.genericId;
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    this.genericTypeIds = decoded.generic_type_id ? decoded.generic_type_id.split(',') : [];
  }

  async ngOnInit() {
    await this.getGenericDosages();
    await this.getGenericGroups();
    await this.getGenericTypes();
    await this.getProductTypes();
    await this.getAccounts();
    await this.getMinMaxGroup();
    await this.getBidTypes();
    await this.getConversions();
    await this.getPrimaryUnits();
    await this.getED();
    await this.getDetail();
  }

  async getConversions() {
    this.loadingModal.show();
    try {
      const resp: any = await this.uomService.getConversionList(this.genericId);
      this.loadingModal.hide();
      if (resp.ok) {
        this.conversions = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.message);
    }
  }

  async tapGeneric() {
    await this.getConversions()
  }
  async getPrimaryUnits() {
    this.loadingModal.show();
    try {
      const resp: any = await this.uomService.getPrimaryUnits();
      this.loadingModal.hide();
      if (resp.ok) {
        this.primaryUnits = resp.rows;
        let idx = _.findIndex(resp.rows, { "unit_id": this.primaryUnitId });
        idx > -1 ? this.unitName = resp.rows[idx].unit_name : this.unitName = null;
      } else {
        console.error(resp.error);
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      console.log(error.message);
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getBidTypes() {
    this.loadingModal.show();
    try {
      const resp: any = await this.standardService.getBidTypes();
      this.loadingModal.hide();
      if (resp.ok) {
        this.bidTypes = resp.rows;
        this.bidTypeId = this.bidTypes[0].bid_id;
      } else {
        console.log(resp.error)
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getDetail() {
    this.loadingModal.show();
    try {
      const rs: any = await this.genericService.getDetail(this.genericId);
      this.loadingModal.hide();
      if (rs.detail) {
        this.genericId = rs.detail.generic_id;
        this.genericName = rs.detail.generic_name;
        this.workingCode = rs.detail.working_code;
        this.drugAccountId = rs.detail.account_id;
        this.typeId = rs.detail.generic_type_id;
        this.typeOldId = rs.detail.generic_type_id;
        this.dosageId = rs.detail.dosage_id;
        this.pTypeId = rs.detail.generic_hosp_id;
        this.edId = rs.detail.group_ed;
        this.groupId1 = rs.detail.group_code_1;
        this.groupId2 = rs.detail.group_code_2;
        this.groupId3 = rs.detail.group_code_3;
        this.groupId4 = rs.detail.group_code_4;
        this.description = rs.detail.description;
        this.primaryUnitId = rs.detail.primary_unit_id;
        this.isActive = rs.detail.is_active === 'Y' ? true : false;
        this.isPlanning = rs.detail.is_planning === 'Y' ? true : false;
        this.minQty = +rs.detail.min_qty;
        this.maxQty = +rs.detail.max_qty;
        this.eoqQty = +rs.detail.eoq_qty;
        this.carryingCost = +rs.detail.carrying_cost;
        this.orderingCost = +rs.detail.ordering_cost;
        this.bidTypeId = rs.detail.purchasing_method;
        this.minmaxGroupId = rs.detail.minmax_group_id ||  null;;
        // this.planningUnitGenericId = rs.detail.planning_unit_generic_id;
        this.keywords = rs.detail.keywords;
        if (this.groupId2) {
          this.getGenericGroup2();
        }
        if (this.groupId3) {
          this.getGenericGroup3();
        }
        if (this.groupId4) {
          this.getGenericGroup4();
        }
        // console.log(this.genericId);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getGenericTypes() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericTypes();
      this.loadingModal.hide();
      if (rs.ok) {
        this.loadingModal.hide();
        if (rs.rows.length) {
          rs.rows.forEach(v => {
            this.genericTypeIds.forEach(x => {
              if (+x === +v.generic_type_id) {
                this.genericTypes.push(v);
              }
            });
          });
        }
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error))
    }
  }
  async getMinMaxGroup() {
    this.loadingModal.show();
    try {
      const rs: any = await this.genericMinmaxGroupsService.all(false);
      this.loadingModal.hide();
      if (rs.ok) {
        this.minmaxGroups = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }
  async getAccounts() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericAccount();
      this.loadingModal.hide();
      if (rs.ok) {
        this.drugAccounts = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async getProductTypes() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getProductTypes();
      this.loadingModal.hide();
      if (rs.ok) {
        this.typeProduct = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async getGenericGroups() {
    // this.loadingModal.show();
    // try {
    //   const rs: any = await this.standardService.getGenericGroups();
    //   this.loadingModal.hide();
    //   if (rs.ok) {
    //     this.genericGroups = rs.rows;
    //   } else {
    //     this.alertService.error(rs.error);
    //   }
    // } catch (error) {
    //   this.loadingModal.hide();
    //   this.alertService.error(JSON.stringify(error));
    //   console.log(error.message);
    // }
    this.getGenericGroup1();
  }

  async getGenericGroup1() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericGroups1();
      this.loadingModal.hide();
      if (rs.ok) {
        this.genericGroup1 = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async getGenericGroup2() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericGroups2(this.groupId1);
      this.loadingModal.hide();
      if (rs.ok) {
        this.genericGroup2 = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async getGenericGroup3() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericGroups3(this.groupId1, this.groupId2);
      this.loadingModal.hide();
      if (rs.ok) {
        this.genericGroup3 = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async getGenericGroup4() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericGroups4(this.groupId1, this.groupId2, this.groupId3);
      this.loadingModal.hide();
      if (rs.ok) {
        this.genericGroup4 = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async getGenericDosages() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericDosages();
      this.loadingModal.hide();
      if (rs.ok) {
        this.genericDosages = rs.rows;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async getED() {
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getED();
      this.loadingModal.hide();
      if (rs.ok) {
        this.ed = rs.rows;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
      console.log(error.message);
    }
  }

  async save() {

    if (this.genericName && this.primaryUnitId && this.typeId && this.workingCode) {
      this.isSaving = true;
      const generics = {
        workingCode: this.workingCode,
        genericName: this.genericName,
        typeId: this.typeId,
        typeOldId: this.typeOldId,
        groupEd: this.edId === 'null' ? null : this.edId,
        groupId1: this.groupId1 === 'null' ? null : this.groupId1,
        groupId2: this.groupId2 === 'null' ? null : this.groupId2,
        groupId3: this.groupId3 === 'null' ? null : this.groupId3,
        groupId4: this.groupId4 === 'null' ? null : this.groupId4,
        dosageId: this.dosageId,
        pTypeId: this.pTypeId,
        description: this.description,
        keywords: this.keywords,
        drugAccountId: this.drugAccountId,
        primaryUnitId: this.primaryUnitId,
        planningMethod: this.planningMethod,
        maxQty: this.maxQty,
        minQty: this.minQty,
        eoqQty: this.eoqQty,
        carryingCost: this.carryingCost,
        orderingCost: this.orderingCost,
        isActive: this.isActive ? 'Y' : 'N',
        isPlanning: this.isPlanning ? 'Y' : 'N',
        purchasingMethod: this.bidTypeId,
        minmaxGroupId: this.minmaxGroupId
        // planningUnitGenericId: this.planningUnitGenericId
      };
      if (!this.genericId) {
        this.alertService.error('ไม่พบรหัสยาที่ต้องการแก้ไข');
        this.isSaving = false;
      } else {
        this.loadingModal.show();
        try {
          const rs: any = await this.genericService.updateGeneric(this.genericId, generics);
          await this.getDetail();
          this.loadingModal.hide();
          if (rs.ok) {
            this.alertService.success();
          } else {
            this.alertService.error(rs.error);
          }
          this.isSaving = false;
        } catch (error) {
          this.loadingModal.hide();
          this.isSaving = false;
          this.alertService.error(error.message);
        }
      }
    } else {
      this.loadingModal.hide();
      this.isSaving = false;
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  keytype() {
    this.isType = true;
  }

  async selectBaseUnit() {
    const idx = _.findIndex(this.primaryUnits, { 'unit_id': +this.primaryUnitId });
    if (idx > -1) {
      this.unitName = this.primaryUnits[idx].unit_name;
    } else {
      this.unitName = null;
    }
  }
}
