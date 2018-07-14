import { Component, OnInit } from '@angular/core';
import { GenericGroupEDService } from '../generic-group-ed.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-generic-group-ed',
  templateUrl: './generic-group-ed.component.html',
  styles: []
})
export class GenericGroupEdComponent implements OnInit {

  genricGroupED: any = [];
  genericGroupEDId: string;
  genericGroupEDName: string;

  opened = false;
  isUpdate = false;
  loading = false;

  constructor(
    private genericGroupEDService: GenericGroupEDService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getList();
  }

  addNew() {
    this.genericGroupEDId = null;
    this.genericGroupEDName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  async getList() {
    try {
      this.loading = true;
      const rs: any = await this.genericGroupEDService.list();
      if (rs.ok) {
        this.genricGroupED = rs.rows;
        this.loading = false;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  edit(p: any) {
    this.genericGroupEDId = p.ed_id;
    this.genericGroupEDName = p.ed_name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.ed_name + ']')
      .then(() => {
        this.genericGroupEDService.remove(p.ed_id)
          .then((results: any) => {
            if (results.ok) {
              this.alertService.success();
              this.getList();
            } else {
              this.alertService.error(JSON.stringify(results.error));
            }
          })
          .catch(() => {
            this.alertService.serverError();
          });
      });
  }

  save() {
    if (this.genericGroupEDName) {
      let promise;
      if (this.isUpdate) {
        promise = this.genericGroupEDService.update(this.genericGroupEDId, this.genericGroupEDName);
      } else {
        promise = this.genericGroupEDService.save(this.genericGroupEDName);
      }

      promise.then((results: any) => {
        if (results.ok) {
          this.alertService.success();
          this.opened = false;
          this.getList();
        } else {
          this.alertService.error('ข้อมูลซ้ำ');
          console.log(results.error);
        }
      })
        .catch(() => {
          this.alertService.serverError();
        });
    }
  }

}
