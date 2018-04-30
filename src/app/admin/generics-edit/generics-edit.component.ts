import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardService } from 'app/admin/standard.service';
import { GenericService } from 'app/admin/generic.service';
import { AlertService } from 'app/admin/alert.service';
import { GenericDrugAccountsService } from 'app/admin/generic-drug-accounts.service';
import { UomService } from 'app/mm-components/uom.service';
import { LoadingComponent } from 'app/loading/loading.component';

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

  isSaving = false;
  loading = false;

  pTypeId: string;
  dosageId: string;
  groupId: string;
  typeId: string;
  typeOldId: string;
  typeFilterId: string;

  genericName: string;
  pName: string;
  genericId: string;
  shortName: string;
  description: string;
  keyword: string;
  drugAccountId: string;
  workingCode: any;
  shortCode: any;
  standardCost = 0;
  isActive: any;
  isPlanning: any;
  planningMethod = 1;
  planningUnitGenericId: null;

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
  constructor(
    private standardService: StandardService,
    private genericService: GenericService,
    private alertService: AlertService,
    private accountService: GenericDrugAccountsService,
    private router: ActivatedRoute,
    private uomService: UomService
  ) {
    this.genericId = this.router.snapshot.params.genericId;

  }

  async ngOnInit() {
    await this.getGenericDosages();
    await this.getGenericGroups();
    await this.getGenericTypes();
    await this.getProductTypes();
    await this.getAccounts();
    await this.getPrimaryUnits();
    await this.getBidTypes();
    await this.getConversions();

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

  async getPrimaryUnits() {
    this.loadingModal.show();
    try {
      const resp: any = await this.uomService.getPrimaryUnits();
      this.loadingModal.hide();
      if (resp.ok) {
        this.primaryUnits = resp.rows;
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
        this.groupId = rs.detail.group_id;
        this.description = rs.detail.description;
        this.standardCost = +rs.detail.standard_cost;
        this.primaryUnitId = rs.detail.primary_unit_id;
        this.isActive = rs.detail.is_active === 'Y' ? true : false;
        this.isPlanning = rs.detail.is_planning === 'Y' ? true : false;
        this.minQty = +rs.detail.min_qty;
        this.maxQty = +rs.detail.max_qty;
        this.eoqQty = +rs.detail.eoq_qty;
        this.carryingCost = +rs.detail.carrying_cost;
        this.orderingCost = +rs.detail.ordering_cost;
        this.bidTypeId = this.bidTypeId ? this.bidTypes[0].bid_id : rs.detail.purchasing_method;
        this.planningUnitGenericId = rs.detail.planning_unit_generic_id;
        this.keyword = rs.detail.keywords;
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
        this.genericTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error))
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
    this.loadingModal.show();
    try {
      const rs: any = await this.standardService.getGenericGroups();
      this.loadingModal.hide();
      if (rs.ok) {
        this.genericGroups = rs.rows;
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

  async save() {

    if (this.genericName && this.primaryUnitId && this.typeId && this.workingCode) {
      this.isSaving = true;
      const generics = {
        genericName: this.genericName,
        typeId: this.typeId,
        typeOldId: this.typeOldId,
        groupId: this.groupId,
        dosageId: this.dosageId,
        pTypeId: this.pTypeId,
        description: this.description,
        keywords: this.keyword,
        drugAccountId: this.drugAccountId,
        primaryUnitId: this.primaryUnitId,
        planningMethod: this.planningMethod,
        standardCost: this.standardCost,
        maxQty: this.maxQty,
        minQty: this.minQty,
        eoqQty: this.eoqQty,
        carryingCost: this.carryingCost,
        orderingCost: this.orderingCost,
        isActive: this.isActive ? 'Y' : 'N',
        isPlanning: this.isPlanning ? 'Y' : 'N',
        purchasingMethod: this.bidTypeId,
        planningUnitGenericId: this.planningUnitGenericId
      };
      if (!this.genericId) {
        this.alertService.error('ไม่พบรหัสยาที่ต้องการแก้ไข');
        this.isSaving = false;
      } else {
        this.loadingModal.show();
        try {
          const rs: any = await this.genericService.updateGeneric(this.genericId, generics);
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
}
