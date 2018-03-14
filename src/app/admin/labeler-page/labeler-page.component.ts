import { } from '@types/googlemaps';

import { Component, OnInit, NgZone, ViewChild, QueryList, ChangeDetectorRef, ElementRef } from '@angular/core';
import { LabelerService } from '../labeler.service';
import { StandardService } from '../standard.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

import { AlertService } from '../alert.service';
import { HelperService } from '../helper.service';

import { ILabeler, IOrganization } from '../../models';
import { LoadingComponent } from 'app/loading/loading.component';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-labeler-page',
  templateUrl: './labeler-page.component.html',
  styleUrls: ['./labeler-page.component.css']
})
export class LabelerPageComponent implements OnInit {
  @ViewChild('loadingModal') loadingModal: LoadingComponent;

  labelers: any = [];

  constructor(
    private labelerService: LabelerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    
    this.getLabelers();
    
  }

  getLabelers() {
    this.loadingModal.show();
    this.labelerService.all()
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
