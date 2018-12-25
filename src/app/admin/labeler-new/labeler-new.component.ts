import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { LabelerService } from 'app/admin/labeler.service';
import { StandardService } from 'app/admin/standard.service';
import { AlertService } from 'app/admin/alert.service';
import { HelperService } from 'app/admin/helper.service';
import { ILabeler, IOrganization } from 'app/models';

import * as moment from 'moment';
declare var google;
import { LoadingComponent } from '../../loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'wm-labeler-new',
  templateUrl: './labeler-new.component.html',
  styles: [`
  agm-map {
    height: 350px;
  }
  `]
})
export class LabelerNewComponent implements OnInit {
  isMapDraggable = true;
  searchControl: FormControl;
  labelers: any = [];
  openModalBank = false;
  openNew = false;
  isSaving = false;
  loading = false;
  loadingRegister = false;
  isUpdate = false;
  openRegister = false;

  labelerId: string;
  labelerCode: string;
  labelerName: string;
  labelerNamePo: string;
  labelerShortCode: string;
  labelerDescription: string;
  labelerNin: string;
  labelerTypeId: string;
  labelerStatusId: string;
  labelerDisableDate: string;
  labelerAddress: string;
  labelerTambon: string;
  labelerAmpur: string;
  labelerProvince: string;
  labelerZipCode: string;
  labelerPhone: string;
  labelerUrl: string;

  // MCD
  mcdLabelerId: string;
  mcdLabelerName: string;

  orgNo: string;
  orgYearRegister: string;
  orgYearEstablished: string;
  orgCountry: string;
  orgFADNumber: string;
  orgLatitude: number;
  orgLongitude: number;

  lat = 16.4321938;
  lng = 102.8236214;

  mapZoom: number;

  labelerTypes: any = [];
  labelerStatus: any = [];
  provinces: any = [];
  ampurs: any = [];
  tambons: any = [];
  countries: any = [];

  mophLabelers: any = [];
  selectedLabelerRegister: any;

  banks = [];
  isUpdateBank = false;
  accountNo: any;
  accountName: any;
  bankName: any;
  bankType: any;
  bankBranch: any;
  bankId: any;
  isManufacturer = false;
  isVendor = false;
  isEDI = false;

  @ViewChild('map') myMap;
  @ViewChild('search') private searchElementRef: ElementRef;
  @ViewChild('loadingModal') private loadingModal: LoadingComponent;
  isUpdateCode = false;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private labelerService: LabelerService,
    private stdService: StandardService,
    private alertService: AlertService,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams
      .subscribe(params => {
        this.labelerId = params.labelerId;
        if (this.labelerId) {
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      });
  }

  async ngOnInit() {
    this.searchControl = new FormControl();

    const rsStatus: any = await this.stdService.getLabelerStatus();
    if (rsStatus.ok) {
      this.labelerStatus = rsStatus.rows;
    }

    const rsLabelerType: any = await this.stdService.getLabelerTypes();
    if (rsLabelerType.ok) {
      this.labelerTypes = rsLabelerType.rows;
    }

    const rsProvince: any = await this.stdService.getChangwat();
    if (rsProvince.ok) {
      this.provinces = rsProvince.rows;
    }

    await this.getCountries();

    if (this.isUpdate) {
      this.getInfo(this.labelerId);
    } else {
      this.setCurrentPosition();
    }

    this.initialMap();
  }

  private initialMap() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.orgLatitude = place.geometry.location.lat();
          this.orgLongitude = place.geometry.location.lng();
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.mapZoom = 15;
        });
      });
    });
  }

  private _initialData() {
    this.isSaving = false;

    // clear form data
    this.labelerCode = null;
    this.labelerId = null;
    this.labelerName = null;
    this.labelerNamePo = null;
    this.labelerShortCode = null;
    this.labelerDescription = null;
    this.labelerNin = null;
    this.labelerTypeId = null;
    this.labelerStatusId = null;
    this.labelerDisableDate = null;
    this.labelerAddress = null;
    this.labelerTambon = null;
    this.labelerAmpur = null;
    this.labelerProvince = null;
    this.labelerZipCode = null;
    this.labelerPhone = null;
    this.labelerUrl = null;

    this.orgNo = null;
    this.orgYearRegister = null;
    this.orgYearEstablished = null;
    this.orgCountry = null;
    this.orgFADNumber = null;

    this.lat = 16.4321938;
    this.lng = 102.8236214;

    this.isUpdate = false;
  }


  save() {

    const labeler: any = {
      labelerName: this.labelerName,
      labelerCode: this.labelerCode,
      labelerNamePo: this.labelerNamePo,
      labelerShortCode: this.labelerShortCode,
      labelerId: this.labelerId,
      labelerNin: this.labelerNin,
      labelerTypeId: this.labelerTypeId,
      labelerStatusId: this.labelerStatusId,
      labelerDisableDate: this.labelerDisableDate,
      labelerDescription: this.labelerDescription,
      labelerAddress: this.labelerAddress,
      labelerProvince: this.labelerProvince,
      labelerAmpur: this.labelerAmpur,
      labelerTambon: this.labelerTambon,
      labelerPhone: this.labelerPhone,
      labelerUrl: this.labelerUrl,
      labelerZipCode: this.labelerZipCode,
      orgLabelerId: this.labelerId,
      orgNo: this.orgNo,
      orgYearEstablished: this.orgYearEstablished,
      orgYearRegister: this.orgYearRegister,
      orgFADNumber: this.orgFADNumber,
      orgLatitude: this.orgLatitude,
      orgLongitude: this.orgLongitude,
      orgCountry: this.orgCountry,
      isVendor: this.isVendor ? 'Y' : 'N',
      isManufacturer: this.isManufacturer ? 'Y' : 'N',
      edi: this.isEDI ? 'Y' : 'N'
    };

    if (!this.labelerName) {
      this.alertService.error('กรุณาระบุข้อมูลเพิ่มเติมให้ครบถ้วน');
    } else {

      this.loadingModal.show();
      let promise;
      if (this.isUpdate) {
        promise = this.labelerService.updateLabeler(labeler);
      } else {
        promise = this.labelerService.saveLabeler(labeler);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.loadingModal.hide();
          this.alertService.success();
          this.router.navigate(['/admin/labeler']);
        } else {
          this.loadingModal.hide();
          this.alertService.error('ข้อมูลซ้ำ');
          console.log(JSON.stringify(results.error));
        }
      })
        .catch(() => {
          this.loadingModal.hide();
          this.alertService.serverError();
        });
    }

  }

  clearOrganizationInfo() {
    this.orgYearEstablished = null;
    this.orgNo = null;
    this.orgCountry = null;
    this.orgFADNumber = null;
    this.orgLatitude = null;
    this.orgLongitude = null;
    this.orgYearRegister = null;
  }

  mapClick(event) {
    const coords: any = event.coords;
    this.orgLatitude = coords.lat;
    this.orgLongitude = coords.lng;
    this.lat = coords.lat;
    this.lng = coords.lng;
  }

  changeProvince() {
    this.stdService.getAmpur(this.labelerProvince)
      .then((results: any) => {
        this.ampurs = results.rows;
        this.tambons = [];
      })
  }

  changeAmpur() {
    this.stdService.getTambon(this.labelerProvince, this.labelerAmpur)
      .then((results: any) => {
        this.tambons = results.rows;
      })
  }

  getCountries() {
    this.stdService.getCountries()
      .then((results: any) => {
        this.countries = results.rows;
      })
  }

  private setCurrentPosition() {
    this.lat = 16.4321938;
    this.lng = 102.8236214;
    // this.orgLatitude = 16.4321938;
    // this.orgLongitude = 102.8236214;
    // this.mapZoom = 15;
  }

  async getInfo(labelerId: any) {
    try {
      this.loadingModal.show();
      const rs: any = await this.labelerService.info(labelerId);
      if (rs.ok) {
        this.labelerId = rs.labeler.labeler_id;
        this.labelerCode = rs.labeler.labeler_code;
        this.labelerName = rs.labeler.labeler_name;
        this.labelerNamePo = rs.labeler.labeler_name_po;
        this.labelerShortCode = rs.labeler.short_code;
        this.labelerDescription = rs.labeler.description;
        this.labelerNin = rs.labeler.nin;
        this.labelerDisableDate = rs.labeler.disable_date ? moment(rs.labeler.disable_date).format('YYYY-MM-DD') : null;
        this.labelerAddress = rs.labeler.address;
        const _labelerTambon = rs.labeler.tambon_code;
        const _labelerAmpur = rs.labeler.ampur_code;
        this.labelerProvince = rs.labeler.province_code;

        this.labelerTypeId = rs.labeler.labeler_type.toString();
        this.labelerStatusId = rs.labeler.labeler_status.toString();
        this.isVendor = rs.labeler.is_vendor === 'Y' ? true : false;
        this.isEDI = rs.labeler.edi === 'Y' ? true : false;
        this.isManufacturer = rs.labeler.is_manufacturer === 'Y' ? true : false;
        const rsAmp: any = await this.stdService.getAmpur(this.labelerProvince);
        if (rsAmp.ok) {
          this.ampurs = rsAmp.rows;
          this.labelerAmpur = _labelerAmpur;
        } else {
          this.alertService.error(rsAmp.error);
        }

        // get tambon
        const rsTambon: any = await this.stdService.getTambon(this.labelerProvince, _labelerAmpur);
        if (rsTambon.ok) {
          this.tambons = rsTambon.rows;
          this.labelerTambon = _labelerTambon;
        } else {
          this.alertService.error(rsTambon.error);
        }
        //
        this.labelerZipCode = rs.labeler.zipcode;
        this.labelerPhone = rs.labeler.phone;
        this.labelerUrl = rs.labeler.url;

        this.orgNo = rs.labeler.org_no;
        this.orgYearEstablished = rs.labeler.year_established;
        this.orgYearRegister = rs.labeler.year_register;
        this.orgFADNumber = rs.labeler.fda_no;
        this.orgLatitude = rs.labeler.latitude ? parseFloat(rs.labeler.latitude) : null;
        this.orgLongitude = rs.labeler.longitude ? parseFloat(rs.labeler.longitude) : null;
        this.lat = rs.labeler.latitude ? parseFloat(rs.labeler.latitude) : null;
        this.lng = rs.labeler.longitude ? parseFloat(rs.labeler.longitude) : null;
        this.orgCountry = rs.labeler.country_code;
        if (this.orgLatitude && this.orgLongitude) {
          this.mapZoom = 15;
        }
        this.getBank();
        if (this.labelerCode != null && this.labelerCode !== undefined && this.labelerCode !== '') {
          this.isUpdateCode = true;
        }
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }

      this.loadingModal.hide();
    } catch (error) {
      console.log(error);

      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  // register(labeler) {
  //   this.isSaving = false;
  //   this.mophLabelers = [];

  //   this.mcdLabelerId = labeler.labeler_id;
  //   this.mcdLabelerName = labeler.labeler_name;
  //   this.openRegister = true;
  //   this.loadingRegister = true;

  //   this.labelerService.mcdGetLabelers()
  //     .then((results: any) => {
  //       if (results.ok) {
  //         this.mophLabelers = results.rows;
  //       } else {
  //         this.alertService.error(JSON.stringify(results.error));
  //       }
  //       this.loadingRegister = false;
  //     })
  //     .catch((error) => {
  //       this.loadingRegister = false;
  //       this.alertService.serverError();
  //     });
  // }

  // newRegisterMcd() {
  //   this.selectedLabelerRegister = {};
  //   this.alertService.confirm(`คุณต้องการลงทะเบียนผู้ค้ารายใหม่ [${this.mcdLabelerName}] กับส่วนกลาง  ใช่หรือไม่?`)
  //     .then(() => {
  //       // save new
  //     })
  //     .catch(error => {
  //       // cancel
  //     });
  // }

  saveRegisterLabelerMCD() {
    // if (this.selectedLabelerRegister) {
    //   this.alertService.confirm('คุณต้องการทำรายการนี้ ใช่หรือไม่?')
    //     .then(() => {
    //       this.isSaving = true;
    //       this.labelerService.mcdSaveLabeler(this.mcdLabelerId, this.selectedLabelerRegister.labeler_id)
    //         .then((results: any) => {
    //           if (results.ok) {
    //             this.alertService.success();
    //             this.openRegister = false;
    //           } else {
    //             this.alertService.error(JSON.stringify(results.error));
    //           }
    //           this.isSaving = false;
    //         })
    //         .catch(() => {
    //           this.alertService.serverError();
    //         });
    //     })
    //     .catch(() => {
    //       // cancel
    //     });
    // }
  }

  doImportMCDData() {
    // this.alertService.confirm('ยืนยันการนำเข้าข้อมูล')
    //   .then(() => {
    //     let labeler: ILabeler = {
    //       labelerAddress: this.selectedLabelerRegister.address,
    //       labelerAmpur: this.selectedLabelerRegister.ampur_code,
    //       labelerTambon: this.selectedLabelerRegister.tambon_code,
    //       labelerProvince: this.selectedLabelerRegister.province_code,
    //       labelerDescription: this.selectedLabelerRegister.description,
    //       labelerDisableDate: this.selectedLabelerRegister.disable_date ?
    //         moment(this.selectedLabelerRegister.disable_date).format('YYYY-MM-DD') : null,
    //       labelerNin: this.selectedLabelerRegister.nin,
    //       labelerName: this.selectedLabelerRegister.labeler_name,
    //       labelerShortCode: this.selectedLabelerRegister.short_code,
    //       labelerStatusId: this.selectedLabelerRegister.labeler_status.toString(),
    //       labelerTypeId: this.selectedLabelerRegister.labeler_type.toString(),
    //       labelerZipCode: this.selectedLabelerRegister.zipcode,
    //       labelerPhone: this.selectedLabelerRegister.phone,
    //       labelerUrl: this.selectedLabelerRegister.url,
    //       labelerMophId: this.selectedLabelerRegister.labeler_id,
    //       labelerRegisterDate: moment().format('YYYY-MM-DD HH:mm:ss')
    //     };

    //     let org: IOrganization = {
    //       orgNo: this.selectedLabelerRegister.org_no,
    //       orgYearEstablished: this.selectedLabelerRegister.year_established,
    //       orgYearRegister: this.selectedLabelerRegister.year_register,
    //       orgFADNumber: this.selectedLabelerRegister.fda_no,
    //       orgLatitude: this.selectedLabelerRegister.latitude,
    //       orgLongitude: this.selectedLabelerRegister.longitude,
    //       orgCountry: this.selectedLabelerRegister.country_code
    //     };

    //     if (labeler.labelerTypeId !== '0' && (!org.orgCountry || !org.orgFADNumber ||
    //       !org.orgNo || !org.orgYearEstablished || !org.orgYearRegister)) {
    //       this.alertService.error('กรุณาระบุข้อมูลเพิ่มเติมให้ครบถ้วน');
    //     } else {
    //       this.isSaving = true;
    //       let promise;
    //       if (this.isUpdate) {
    //         promise = this.labelerService.updateLabeler(labeler, org);
    //       } else {
    //         promise = this.labelerService.saveLabeler(labeler, org);
    //       }

    //       promise.then((results: any) => {
    //         if (results.ok) {
    //           this.alertService.success();
    //           this.openRegister = false;
    //           this.isSaving = false;
    //         } else {
    //           this.alertService.error(JSON.stringify(results.error));
    //         }

    //         // this.isSaving = false;
    //       })
    //         .catch(() => {
    //           this.isSaving = false;
    //           this.alertService.serverError();
    //         });
    //     }
    //   })
    //   .catch(() => {
    //     // cancel
    //   })
  }

  doSaveMCDData() {
    // this.alertService.confirm('ยืนยันการลงทะเบียน')
    //   .then(() => {
    //     this.labelerService.info(this.mcdLabelerId)
    //       .then((results: any) => {
    //         if (results.ok) {
    //           let org_default: any = {
    //             org_no: null,
    //             year_register: null,
    //             year_established: null,
    //             country_code: null,
    //             fda_no: null,
    //             latitude: null,
    //             longitude: null
    //           }
    //           let o = results.organization || org_default;
    //           let l = results.labeler;

    //           let data: any = {
    //             labeler_name: l.labeler_name,
    //             description: l.description,
    //             nin: l.nin,
    //             labeler_type: l.labeler_type,
    //             labeler_status: l.labeler_status,
    //             disable_date: l.disable_date ? moment(l.disable_date).format('YYYY-MM-DD') : null,
    //             address: l.address,
    //             tambon_code: l.tambon,
    //             ampur_code: l.ampur_code,
    //             province_code: l.province_code,
    //             zipcode: l.zipcode,
    //             phone: l.phone,
    //             url: l.url,
    //             hosp_labeler_id: l.labeler_id,
    //             hospcode: '11053',
    //             request_date: moment().format('YYYY-MM-DD'),
    //             org_no: o.org_no,
    //             year_register: o.year_register,
    //             year_established: o.year_established,
    //             country_code: o.country_code,
    //             fda_no: o.fda_no,
    //             latitude: o.latitude,
    //             longitude: o.longitude
    //           };

    //           this.labelerService.mcdSendRegister(data)
    //             .then((_results: any) => {
    //               if (_results.ok) {
    //                 this.labelerService.mcdSaveLabeler(this.mcdLabelerId, _results.rows.labeler_id)
    //                   .then((__results: any) => {
    //                     if (__results.ok) {
    //                       this.alertService.success();
    //                       this.openRegister = false;
    //                     } else {
    //                       this.alertService.error(JSON.stringify(__results.error));
    //                     }
    //                   })
    //                   .catch(() => {
    //                     this.alertService.serverError();
    //                   })
    //               } else {
    //                 this.alertService.error(JSON.stringify(_results.error))
    //               }
    //             })
    //             .catch(() => {
    //               this.alertService.serverError();
    //             });
    //         } else {
    //           this.alertService.error(JSON.stringify(results.error));
    //         }
    //       });
    //   })
    //   .catch(() => {
    //     // cancel
    //   });
  }

  setDnGLatLng(e) {
    this.orgLatitude = e.coords.lat;
    this.orgLongitude = e.coords.lng;
  }

  async getBank() {
    this.loadingModal.show();
    const rsBank: any = await this.labelerService.getBank(this.labelerId);
    if (rsBank.ok) {
      this.banks = rsBank.rows;
    }
    this.loadingModal.hide();
  }

  addBank() {
    this.accountNo = '';
    this.accountName = '';
    this.bankName = '';
    this.bankType = '';
    this.bankBranch = '';
    this.openModalBank = true;
  }

  async saveBank() {
    try {
      this.openModalBank = false;
      this.loadingModal.show();
      const data = {
        account_no: this.accountNo,
        account_name: this.accountName,
        bank_name: this.bankName,
        bank_type: this.bankType,
        bank_branch: this.bankBranch,
        labeler_id: this.labelerId
      }
      let rs: any;
      if (!this.isUpdateBank) {
        rs = await this.labelerService.saveBank(data);
      } else {
        rs = await this.labelerService.updateBank(this.bankId, data);
      }
      if (!rs.ok) {
        this.alertService.error('ข้อมูลซ้ำ');
      } else {
        this.alertService.success();
        this.getBank();
      }
      this.loadingModal.hide();

    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  editBank(bank) {
    this.isUpdateBank = true;
    this.accountNo = bank.account_no;
    this.accountName = bank.account_name;
    this.bankName = bank.bank_name;
    this.bankType = bank.bank_type;
    this.bankBranch = bank.bank_branch;
    this.bankId = bank.bank_id;
    this.openModalBank = true;
  }

  async removeBank(bank) {
    try {
      this.alertService.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')
        .then(async (result) => {
          this.loadingModal.show();
          await this.labelerService.removeBank(bank.bank_id);
          this.getBank();
          this.loadingModal.hide();
        }).catch((err) => {

        });
    } catch (error) {
      this.loadingModal.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }
}
