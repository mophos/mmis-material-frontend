import { Component, OnInit, NgZone, ViewChild, QueryList, ChangeDetectorRef, ElementRef } from '@angular/core';
import { LabelerService } from '../labeler.service';
import * as _ from 'lodash';
import { AlertService } from '../alert.service';
import { LoadingComponent } from 'app/loading/loading.component';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-labeler-page',
  templateUrl: './labeler-page.component.html',
  styleUrls: ['./labeler-page.component.css']
})
export class LabelerPageComponent implements OnInit {
  @ViewChild('loadingModal') loadingModal: LoadingComponent;

  labelers: any = [];
  jwtHelper: JwtHelper = new JwtHelper();
  menuDelete = false;
  btnDelete = false;
  constructor(
    private labelerService: LabelerService,
    private alertService: AlertService
  ) {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    const accessRight = decoded.accessRight.split(',');
    this.menuDelete = _.indexOf(accessRight, 'MM_DELETED') === -1 ? false : true;
  }

  ngOnInit() {

    this.getLabelers();

  }

  manageDelete() {
    this.btnDelete = !this.btnDelete;
    this.getLabelers();
  }

  getLabelers() {
    this.loadingModal.show();
    this.labelerService.all(this.btnDelete)
      .then((results: any) => {
        this.loadingModal.hide();
        if (results.ok) {
          this.labelers = results.rows;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(error => {
        this.loadingModal.hide();
        this.alertService.serverError();
      });
  }

  removeLabeler(labeler) {
    this.alertService.confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่? [' + labeler.labeler_name + ']')
      .then(() => {
        this.labelerService.remove(labeler.labeler_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.labelers, { 'labeler_id': labeler.labeler_id });
              if (idx > -1) {
                if (this.btnDelete) {
                  this.labelers[idx].is_deleted = 'Y';
                } else {
                  this.labelers.splice(idx, 1);
                }
              }
              this.alertService.success();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          })
      }).catch(() => { });
  }

  returnDelete(labeler) {
    this.alertService.confirm('คุณต้องการยกเลิกการลบรายการนี้ ใช่หรือไม่? [' + labeler.labeler_name + ']')
      .then(() => {
        this.labelerService.return(labeler.labeler_id)
          .then((results: any) => {
            if (results.ok) {
              const idx = _.findIndex(this.labelers, { 'labeler_id': labeler.labeler_id });
              if (idx > -1) {
                this.labelers[idx].is_deleted = 'N';
              }
              this.alertService.success();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          })
      }).catch(() => { });
  }

}
