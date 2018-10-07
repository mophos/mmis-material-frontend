import { UploadingService } from './../../uploading.service';
import { UomService } from './../../mm-components/uom.service';
import { AlertService } from './../alert.service';
import { ProductService } from './../product.service';
import { RequestOptions, Headers } from '@angular/http';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { CompleterService, CompleterData, RemoteData } from 'ag2-completer';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { LoadingComponent } from 'app/loading/loading.component';

@Component({
  selector: 'wm-product-edit',
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {
  @ViewChild('planning') planning: any;
  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  dataServiceM: any;
  dataServiceV: any;
  dataServiceGeneric: any;
  selectedM: any = null;
  selectedV: any = null;
  vLabelerName: any = null;
  mLabelerName: any = null;
  selectedGenericId: any = null;
  selectedGenericName: any = null;
  selectedGenericCode: any = null;
  isRawMaterial = false;
  pickingRuleId = null;
  isActive = false;
  isSaving = false;
  isType = false;
  // standardCost: number = 0;
  // planningMethod: string;
  // minQty: number = 0;
  // maxQty: number = 0;
  // eoqQty: number = 0;

  orderingCost = 0;
  carryingCost = 0;

  isLotControl = false;
  description = null;
  isLoading = false;
  primaryUnits = [];
  productGroups = [];
  purchaseUnits = [];
  issueUnits = [];
  productId = null;
  productName = null;
  primaryUnitId = null;
  truePrimaryUnitId = null;
  purchaseUnitId = null;
  issueUnitId = null;
  workingCode = null;
  reg_no = null;
  genericId = null;
  purchasePrice = 0;
  keywords = null;
  productGroupsId = null;
  // productGroupOldId = null;

  files: any = [];
  filesToUpload: Array<File>;
  isUploading = false;
  imageUrl: any = null;

  conversions = [];

  purchaseUnitProductId: null;
  issueUnitProductId: null;
  modalPicture = false;
  constructor(
    private completerService: CompleterService,
    private productService: ProductService,
    @Inject('API_URL') private url: string,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private uomService: UomService,
    private uploadingService: UploadingService,
    @Inject('DOC_URL') private docUrl: string,
    @Inject('PRODUCT_IMAGE_PREFIX') private productImagePrefix: string,
  ) {

    this.filesToUpload = [];
    this.productId = this.route.snapshot.params.productId;
    const token = sessionStorage.getItem('token');

    // const apiUrl = `${this.url}/labelers/search?token=${token}&query=`;
    // const apiUrlGeneric = `${this.url}/products/search-generic?token=${token}&query=`;
    // this.dataServiceM = completerService.remote(apiUrl, 'labeler_name', 'labeler_name')
    // this.dataServiceV = completerService.remote(apiUrl, 'labeler_name', 'labeler_name')
    // this.dataServiceGeneric = completerService.remote(apiUrlGeneric, 'generic_name', 'generic_name')
  }

  async ngOnInit() {
    this.getInfo();
  }

  async getInfo() {
    await this.getFilesList();
    await this.getProductGroups();
    await this.getProductDetail();
    await this.getPrimaryUnits();
    await this.getUnits();
    await this.getConversions();
  }

  async getPrimaryUnits() {
    this.loadingModal.show();
    try {
      const resp: any = await this.uomService.getPrimaryUnits();
      this.loadingModal.hide();
      if (resp.ok) {
        this.primaryUnits = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.message);
    }
  }

  getPlanning() {
    this.planning.getPlannings();
  }

  async getUnits() {
    this.loadingModal.show();
    try {
      const resp: any = await this.uomService.getActiveGenericUnits(this.genericId);
      this.loadingModal.hide();
      if (resp.ok) {
        this.purchaseUnits = resp.rows;
        this.issueUnits = _.clone(this.purchaseUnits);
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.message);
    }
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

  clearManufacture() {
    this.selectedM = null;
  }

  clearGeneric() {
    this.selectedGenericId = null;
  }

  clearVendor() {
    this.selectedV = null;
  }

  selectedGeneric(event) {
    try {
      this.selectedGenericId = event.generic_id;
      this.selectedGenericName = event.generic_name;
      this.selectedGenericCode = event.working_code
    } catch (error) {
      console.error(error.message);
    }
  }

  clearOnChangeGeneric(event: any) {
    if (event) this.selectedGenericId = null;
  }

  clearOnChangeManufacture(event: any) {
    if (event) this.selectedM = null;
  }

  clearOnChangeVendor(event: any) {
    if (event) this.selectedV = null;
  }

  selectedManufacture(event) {
    try {
      this.selectedM = event.labeler_id;
      this.mLabelerName = event.labeler_name;
    } catch (error) {
      console.error(error.message);
    }
  }

  selectedVendor(event) {
    try {
      this.selectedV = event.labeler_id;
      this.vLabelerName = event.labeler_name;
    } catch (error) {
      console.log(error.message);
    }
  }

  async getProductDetail() {
    try {
      this.loadingModal.show();
      const resp: any = await this.productService.detail(this.productId);
      this.loadingModal.hide();
      if (resp.ok) {
        this.productName = resp.detail.product_name;
        this.isRawMaterial = resp.detail.is_raw_material === 'Y' ? true : false;
        this.selectedGenericId = resp.detail.generic_id;
        this.selectedGenericCode = resp.detail.generic_code;
        this.selectedGenericName = resp.detail.generic_name;
        this.vLabelerName = resp.detail.v_labeler;
        this.mLabelerName = resp.detail.m_labeler;
        this.selectedM = resp.detail.m_labeler_id;
        this.selectedV = resp.detail.v_labeler_id;
        this.purchasePrice = resp.detail.purchase_cost;
        this.purchaseUnitId = resp.detail.purchase_unit_id;
        this.issueUnitId = resp.detail.issue_unit_id;
        this.primaryUnitId = resp.detail.primary_unit_id;
        this.truePrimaryUnitId = resp.detail.primary_unit_id;
        this.workingCode = resp.detail.working_code;
        this.reg_no = resp.detail.reg_no;
        this.genericId = resp.detail.generic_id;
        this.selectedGenericName = resp.detail.generic_name;
        this.pickingRuleId = resp.detail.picking_rule_id;
        this.keywords = resp.detail.keywords;
        this.productGroupsId = resp.detail.product_group_id;
        // this.productGroupOldId = resp.detail.product_group_id;
        this.isActive = resp.detail.is_active === 'Y' ? true : false;
        this.isRawMaterial = resp.detail.is_raw_material === 'Y' ? true : false;
        this.isLotControl = resp.detail.is_lot_control === 'Y' ? true : false;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.message);
    }
  }

  async saveProduct() {
    const data: any = {};
    data.productName = this.productName;
    data.isRawMaterial = this.isRawMaterial ? 'Y' : 'N';
    data.selectedGenericId = this.selectedGenericId;
    data.mLabelerId = this.selectedM;
    data.vLabelerId = this.selectedV;
    data.pickingRuleId = this.pickingRuleId;
    data.isActive = this.isActive ? 'Y' : 'N';
    data.isLotControl = this.isLotControl ? 'Y' : 'N';
    data.discription = this.description;
    data.purchaseUnitId = this.purchaseUnitId;
    data.issueUnitId = this.issueUnitId;
    data.primaryUnitId = this.primaryUnitId;
    data.workingCode = this.workingCode;
    data.reg_no = this.reg_no;
    data.purchasePrice = this.purchasePrice;
    data.keywords = this.keywords;
    data.productGroupId = this.productGroupsId;
    this.isType = false;
    // data.productGroupOldId = this.productGroupOldId;
    // data.minQty = this.minQty || 0;
    // data.maxQty = this.maxQty || 0;
    // data.planningMethod = this.planningMethod;
    // data.eoqQty = this.eoqQty || 0;
    // data.carryingCost = this.carryingCost || 0;
    // data.orderingCost = this.orderingCost || 0;
    // data.standardCost = this.standardCost || 0;
    try {
      this.loadingModal.show();
      const resp: any = await this.productService.update(this.productId, data);
      this.loadingModal.hide();
      if (resp.ok) {
        this.alertService.success();
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.message);
    }
  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = [];
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  upload() {
    const documentCode = `${this.productImagePrefix}-${this.productId}`;
    this.isUploading = true;
    this.uploadingService.makeFileRequest(documentCode, this.filesToUpload)
      .then((result: any) => {
        this.isUploading = false;
        if (result.ok) {
          this.filesToUpload = [];
          this.alertService.success();
          // this.getFilesList();
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
      }, (error) => {
        this.isUploading = false;
        this.alertService.error(JSON.stringify(error));
      });
  }

  openFile() {
    // if (this.imageUrl) {
    //   window.open(this.imageUrl, '_blank');
    // } else {
    //   this.alertService.error('ไม่พบไฟล์ที่ต้องการ');
    // }
    this.modalPicture = true;
    // console.log('open file');

  }

  getFilesList() {
    this.files = [];
    const file = `${this.productImagePrefix}-${this.productId}`;
    try {
      this.uploadingService.getFiles(file)
        .then((result: any) => {
          if (result.ok) {
            this.files = result.rows;
            const lastImage: any = this.files[0];
            // console.log(lastImage);
            const documentId = lastImage.document_id ? lastImage.document_id : null;
            const url = `${this.docUrl}/uploads/files/${documentId}`;
            this.imageUrl = url;
          } else {
            this.alertService.error(JSON.stringify(result.error));
          }
        })
        .catch(() => {
          // this.alertService.serverError();
        });
    } catch (error) {
      // this.alertService.error();
    }

  }

  keytype() {
    this.isType = true;
  }

  async getProductGroups() {
    this.loadingModal.show();
    try {
      const rs: any = await this.productService.getProductGroups();
      this.loadingModal.hide();
      if (rs.ok) {
        this.productGroups = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.message);
    }
  }
}
