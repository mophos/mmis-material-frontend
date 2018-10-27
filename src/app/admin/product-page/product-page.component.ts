import { SearchGenericsBoxComponent } from './../../mm-components/search-generics-box/search-generics-box.component';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { CompleterService, CompleterData, RemoteData } from 'ag2-completer';
import { LabelerService } from '../labeler.service';
import { GenericService } from '../generic.service';
import { GenericSuppliesService } from '../generic-supplies.service';
import { PackageService } from '../package.service';
import { ProductService } from '../product.service';
import { AlertService } from '../alert.service';
import { UomService } from './../../mm-components/uom.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { State } from '@clr/angular';
import { LoadingComponent } from 'app/loading/loading.component';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  @ViewChild('selectGeneric') public selectGeneric;
  @ViewChild('vlabeler') public vlabeler;
  @ViewChild('mlabeler') public mlabeler;
  @ViewChild('pagination') pagination: any;

  primaryUnitId = null;
  newProductName = null;
  dataServiceM: any;
  dataServiceV: any;
  dataServiceGeneric: any;
  selectedM: any = null;
  selectedV: any = null;
  vLabelerName: any = null;
  mLabelerName: any = null;
  selectedGenericId: any = null;
  selectedGenericName: any = null;
  products = [];
  loading = false;

  groups: any = [];
  groupId = 'all';

  isSearch = false;
  query: string = null;
  perPage = 15;
  total = 0;
  currentPage = 1;

  isSaving = false;

  primaryUnits = [];

  // new modal
  mdlNew = false;

  genericTypeIds: any = [];
  jwtHelper: JwtHelper = new JwtHelper();
  menuDelete = false;
  btnDelete = false;
  constructor(
    private completerService: CompleterService,
    private productService: ProductService,
    private alertService: AlertService,
    private uomService: UomService,
    private router: Router,
    @Inject('API_URL') private url: string,
  ) {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    const accessRight = decoded.accessRight.split(',');
    this.menuDelete = _.indexOf(accessRight, 'MM_DELETED') === -1 ? false : true;
    this.genericTypeIds = decoded.generic_type_id ? decoded.generic_type_id.split(',') : [];
    this.currentPage = +sessionStorage.getItem('productCurrentPage') ? +sessionStorage.getItem('productCurrentPage') : 1;
  }

  async ngOnInit() {
    await this.getPrimaryUnits();
    await this.getGroupList();
  }

  async getProductList(event) {
    try {
      if (this.query) {
        this.searchProduct();
      } else {

        this.loadingModal.show();
        let results: any;
        if (this.groupId === 'all') {
          results = await this.productService.all(this.perPage, 0, this.genericTypeIds, this.btnDelete);
          sessionStorage.setItem('productGroupId', JSON.stringify(this.genericTypeIds));
        } else {
          results = await this.productService.all(this.perPage, 0, this.groupId, this.btnDelete);
          sessionStorage.setItem('productGroupId', JSON.stringify(this.groupId));
        }
        this.loadingModal.hide();
        if (results.ok) {
          this.products = results.rows;
          this.total = +results.total;
          this.currentPage = 1;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      }
    } catch (error) {
      // this.loading = false;
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async returnDelete(productId) {
    this.loadingModal.show();
    try {
      const resp: any = await this.productService.returnDelete(productId);
      this.loadingModal.hide();
      if (resp.ok) {
        const idx = _.findIndex(this.products, { 'product_id': productId })
        this.products[idx].mark_deleted = 'N';
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.message);
    }
  }

  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.searchProduct();
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

  async getGroupList() {
    try {
      this.loadingModal.show();
      const rs: any = await this.productService.getGenericTypes();
      this.loadingModal.hide();
      if (rs.ok) {
        if (rs.rows.length) {
          rs.rows.forEach(v => {
            this.genericTypeIds.forEach(x => {
              if (+x === +v.generic_type_id) {
                this.groups.push(v);
              }
            });
          });

          this.groupId = 'all';
          sessionStorage.setItem('productGroupId', JSON.stringify(this.genericTypeIds));
        }
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.serverError();
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
      this.selectedGenericId = event ? event.generic_id : null;
    } catch (error) {
      console.log(error.message);
    }
  }

  selectedManufacture(event) {
    try {
      this.selectedM = event ? event.labeler_id : null;
    } catch (error) {
      console.log(error.message);
    }
  }

  selectedVendor(event) {
    try {
      this.selectedV = event ? event.labeler_id : null;
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveProduct() {

    this.loadingModal.show();
    this.isSaving = true;

    const products = {
      productName: this.newProductName,
      genericId: this.selectedGenericId,
      mLabelerId: this.selectedM,
      vLabelerId: this.selectedV,
      primaryUnitId: this.primaryUnitId
    };

    try {
      const resp: any = await this.productService.fastSave(products);
      this.loadingModal.hide();
      if (resp.ok) {
        this.router.navigate(['/admin/products', resp.productId]);
      } else {
        this.alertService.error('ข้อมูลซ้ำ');
        console.log(resp.error);
      }
      this.mdlNew = false;
      this.isSaving = false;
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(error.massage);
      this.isSaving = false;
    }
  }

  clearForm() {
    this.isSaving = false;
    this.selectedGenericId = null;
    this.selectedGenericName = null;
    this.selectedM = null;
    this.selectedV = null;
    this.newProductName = null;
    this.primaryUnitId = null;
    this.mLabelerName = null;
    this.vLabelerName = null;
    this.selectGeneric.clearSearch();
    this.vlabeler.clearSearch();
    this.mlabeler.clearSearch();
  }

  async searchProduct() {
    try {
      this.loadingModal.show();
      this.loading = true;
      this.isSearch = true;
      let results: any;
      if (this.groupId === 'all') {
        results = await this.productService.search(this.query || '', this.perPage, 0, this.genericTypeIds, this.btnDelete);
      } else {
        results = await this.productService.search(this.query || '', this.perPage, 0, this.groupId, this.btnDelete);
      }
      this.loading = false;
      if (results.ok) {
        this.products = results.rows;
        this.total = +results.total;
        this.loadingModal.hide();
      } else {
        this.loadingModal.hide();
        this.alertService.error(JSON.stringify(results.error));
      }

    } catch (error) {
      this.loadingModal.hide();
      this.loading = false;
      this.alertService.serverError();
    }
  }

  markDeleted(productId: any) {
    this.alertService.confirm('ต้องการลบรายการ ใช่หรือไม่?')
      .then(() => {
        this.loadingModal.show();
        this.productService.markDeleted(productId)
          .then((rs: any) => {
            this.loadingModal.hide();
            if (rs.ok) {
              const idx = _.findIndex(this.products, { 'product_id': productId });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.products[idx].mark_deleted = 'Y';
                } else {
                  this.products.splice(idx, 1);
                }
              }
            } else {
              this.alertService.error(rs.error);
            }
          }).catch((error: any) => {
            this.loadingModal.hide();
            this.alertService.error(error.message)
          });
      }).catch(() => {
        this.loadingModal.hide();
      });
  }

  enterSearch(event) {
    if (event.target.value === '') {
      this.searchProduct();
    }
    if (event.keyCode === 13) {
      this.searchProduct();
    } else {
      setTimeout(() => {
        this.searchProduct();
      }, 550);
    }
  }
  // เพิ่มรายการสินค้าใหม่
  showAddProduct() {
    this.mdlNew = true;
  }

  async refresh(state: State) {
    const offset = +state.page.from;
    const limit = this.perPage;

    if (!this.currentPage) {
      this.currentPage = this.pagination.currentPage;
    } else {
      this.currentPage = this.currentPage > this.pagination.lastPage ? this.pagination.currentPage : this.pagination.currentPage;
    }

    sessionStorage.setItem('productCurrentPage', this.pagination.currentPage);

    let _groupId = [];
    _groupId = sessionStorage.getItem('productGroupId') ? JSON.parse(sessionStorage.getItem('productGroupId')) : this.genericTypeIds;
    this.loadingModal.show();

    if (this.isSearch) {
      try {
        const results: any = await this.productService.search(this.query, limit, offset, _groupId, this.btnDelete);
        this.loadingModal.hide();
        if (results.ok) {
          this.products = results.rows;
          this.total = results.total;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      } catch (error) {
        this.loadingModal.hide();
        this.alertService.error(JSON.stringify(error));
      }
    } else {
      try {
        const results: any = await this.productService.all(limit, offset, _groupId, this.btnDelete);
        this.loadingModal.hide();
        if (results.ok) {
          this.products = results.rows;
          this.total = +results.total;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      } catch (error) {
        this.loadingModal.hide();
        this.alertService.serverError();
      }
    }
  }
}
