import { AlertService } from './../../admin/alert.service';
import { MappingsService } from './../mappings.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LoadingComponent } from 'app/loading/loading.component';

@Component({
  selector: 'wm-mappings',
  templateUrl: './mappings.component.html',
  styles: []
})
export class MappingsComponent implements OnInit {

  ediLabelerCode: any = null;
  tmtId: any = null;
  dcId: any = null;
  @ViewChild('loadingModal') loadingModal: LoadingComponent;
  @Input('productId') productId: any;
  constructor(
    private mappingsService: MappingsService,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    await this.getData();
  }

  async save() {
    try {
      this.loadingModal.show()
      const data: any = {
        edi_labeler_code: this.ediLabelerCode,
        tmt_id: this.tmtId,
        std_code: this.dcId
      }
      await this.mappingsService.saveMappgins(this.productId, data);
      this.loadingModal.hide()
      this.alertService.success();
    } catch (error) {
      this.loadingModal.hide()
      this.alertService.error(error);
    }
  }

  async getData() {
    try {
      this.loadingModal.show()
      const data = await this.mappingsService.getMappgins(this.productId);
      if (data.ok) {
        this.ediLabelerCode = data.rows.edi_labeler_code;
        this.tmtId = data.rows.tmt_id;
        this.dcId = data.rows.std_code;
      }
      this.loadingModal.hide()
    } catch (error) {
      this.loadingModal.hide()
      this.alertService.error(error);
    }
  }

  setTmtCode(event) {
    this.tmtId = event.tmtid;
  }

  setDC24Code(event) {
    this.dcId = event.id;
  }


}
