import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardService } from '../standard.service';
import { LoadingComponent } from 'app/loading/loading.component';
import { GenericService } from '../generic.service';
import * as _ from 'lodash';
import { AlertService } from '../alert.service';

@Component({
  selector: 'wm-generic-planning-edit',
  templateUrl: './generic-planning-edit.component.html',
  styleUrls: []
})
export class GenericPlanningEditComponent implements OnInit {
  warehouse: any = [];
  genericTypes: any = [];

  query: any;
  warehouseId: any;
  dstWarehouseId: any;
  generics: any;
  genericTypeId: any;
  selectedGenerics: any;
  selectedGenericName: any;

  @ViewChild('loadingModal') loadingModal: LoadingComponent
  constructor(
    private router: ActivatedRoute,
    private standardService: StandardService,
    private genericService: GenericService,
    private alertService: AlertService
  ) {
    this.warehouseId = this.router.snapshot.params.warehouseId;
  }

  ngOnInit() {
    this.getGeneric(this.warehouseId);
    this.getGenericType();
    this.getWarehouses();
  }

  async getGeneric(warehouseId: any) {
    this.loadingModal.show();
    this.generics = [];
    try {
      const rs = await this.genericService.getGenericPlanning(warehouseId);
      if (rs.ok) {
        this.generics = rs.rows;
      }
      this.loadingModal.hide();
    } catch (error) {
      this.loadingModal.hide();
      console.log(error);
    }
  }

  async getGenericType() {
    this.loadingModal.show();
    this.genericTypes = [];
    try {
      const rs = await this.standardService.getGenericTypes();
      if (rs.ok) {
        this.genericTypes = rs.rows;
        this.genericTypeId = rs.rows[0].generic_type_id;
      }
      this.loadingModal.hide();
    } catch (error) {
      this.loadingModal.hide();
      console.log(error)
    }
  }

  async onBlurMin(event: any, genericPlanningId: any, minQty: any) {
    let newValue = event.target.value;
    if (minQty != newValue) {
      try {
        await this.genericService.updateMin(genericPlanningId, newValue);
      } catch (error) {
        console.log(error)
      }
    }
  }

  async onBlurMax(event: any, genericPlanningId: any, maxQty: any) {
    let newValue = event.target.value;
    if (maxQty != newValue) {
      try {
        await this.genericService.updateMax(genericPlanningId, newValue);
      } catch (error) {
        console.log(error)
      }
    }
  }

  async addAll() {
    this.loadingModal.show();
    try {
      this.alertService.confirm('ต้องการเพิ่มรายการทั้งหมด ใช่หรือไม่?')
        .then(() => {
          this.genericService.addAllGenericPlanning(this.warehouseId, this.genericTypeId)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.getGeneric(this.warehouseId);
              } else {
                this.alertService.error('รายการซ้ำ');
              }
            })
        })
      this.loadingModal.hide();
    } catch (error) {
      this.alertService.error();
      console.log(error);
    }
  }

  async add() {
    this.selectedGenericName = null;
    this.loadingModal.show();
    try {
      this.alertService.confirm('ต้องการเพิ่มรายการนี้ ใช่หรือไม่?')
        .then(() => {
          this.genericService.addGenericPlanning(this.warehouseId, this.selectedGenerics)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.getGeneric(this.warehouseId);
              } else {
                this.alertService.error('รายการซ้ำ');
              }
            })
        })
      this.loadingModal.hide();
    } catch (error) {
      this.alertService.error();
      console.log(error);
    }
  }

  async delAll() {
    this.loadingModal.show();
    try {
      this.alertService.confirm('ต้องการลบทั้งหมด ใช่หรือไม่?')
        .then(() => {
          this.genericService.deleteGenericWarehouse(this.warehouseId)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.getGeneric(this.warehouseId);
              } else {
                this.alertService.error('รายการซ้ำ');
              }
            })
        })
      this.loadingModal.hide();
    } catch (error) {
      this.alertService.error();
      console.log(error);
    }
  }

  async addByWarehouse() {
    this.loadingModal.show();
    try {
      this.alertService.confirm('ต้องการเพิ่มรายการนี้ ใช่หรือไม่?')
        .then(() => {
          this.genericService.addGenericPlanningByWarehouse(this.warehouseId, this.dstWarehouseId)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.getGeneric(this.warehouseId);
              } else {
                this.alertService.error('รายการซ้ำ');
              }
            })
        })
      this.loadingModal.hide();
    } catch (error) {
      this.alertService.error();
      console.log(error);
    }
  }

  async remove(g: any) {
    this.loadingModal.show();
    try {
      this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่')
        .then(() => {
          this.genericService.deleteGenericPlanning(g.generic_planning_id)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.getGeneric(this.warehouseId);
              } else {
                this.alertService.error('รายการซ้ำ');
              }
            })
        })
      this.loadingModal.hide();
    } catch (error) {
      this.alertService.error();
      console.log(error);
    }
  }

  selectedGeneric(event) {
    this.selectedGenerics = event;
  }

  enterSearch(event: any) {
    if (event.target.value === '') {
      this.searchGenerics();
    }
    if (event.keyCode === 13) {
      this.searchGenerics();
    } else {
      setTimeout(() => {
        this.searchGenerics();
      }, 550);
    }
  }

  async searchGenerics() {
    try {
      const rs: any = await this.standardService.searchGenerics(this.query, this.warehouseId);
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  async getWarehouses() {
    this.loadingModal.show();
    try {
      const rs = await this.standardService.getWarehouses();
      if (rs.ok) {
        this.warehouse = rs.rows;
        this.loadingModal.hide();
      }
    } catch (error) {
      this.loadingModal.hide();
      console.log(error);
    }
  }
}
