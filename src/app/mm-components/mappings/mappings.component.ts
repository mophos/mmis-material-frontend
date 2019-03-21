import { AlertService } from './../../admin/alert.service';
import { MappingsService } from './../mappings.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-mappings',
  templateUrl: './mappings.component.html',
  styles: []
})
export class MappingsComponent implements OnInit {

  ediLabelerCode: any;
  @Input('productId') productId: any;
  constructor(
    private mappingsService: MappingsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getData();
  }

  async save() {
    try {
      await this.mappingsService.saveEdiLabelerCode(this.productId, this.ediLabelerCode);
      this.alertService.success();
    } catch (error) {
      this.alertService.error(error);
    }
  }

  async getData() {
    try {
      const ediLabelerCode = await this.mappingsService.getEdiLabelerCode(this.productId);
      if (ediLabelerCode.ok) {
        this.ediLabelerCode = ediLabelerCode.rows;
      }
    } catch (error) {

    }
  }

}
