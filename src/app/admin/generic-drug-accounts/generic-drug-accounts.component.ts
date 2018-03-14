import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GenericDrugAccountsService } from '../generic-drug-accounts.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'wm-generic-drug-accounts',
  templateUrl: './generic-drug-accounts.component.html',
  styleUrls: ['./generic-drug-accounts.component.css']
})
export class GenericDrugAccountsComponent implements OnInit {


  accounts: any = [];
  drugAccountId: string;
  drugAccountName: string;

  opened: boolean = false;
  isUpdate: boolean = false;
  loading: boolean = false;

  constructor(
    private drugAccountService: GenericDrugAccountsService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getList();
  }

  addNew() {
    this.drugAccountId = null;
    this.drugAccountName = null;
    this.isUpdate = false;
    this.opened = true;
  }

  getList() {
    this.loading = true;
    this.drugAccountService.all()
      .then((results: any) => {
        if (results.ok) {
          this.accounts = results.rows;
          this.ref.detectChanges();
          this.loading = false;
        } else {
          this.alertService.error(JSON.stringify(results.error));
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }

  edit(p: any) {
    this.drugAccountId = p.id;
    this.drugAccountName = p.name;
    this.isUpdate = true;
    this.opened = true;
  }

  remove(p: any) {
    this.alertService.confirm('ต้องการลบ ใช่หรือไม่? [' + p.name + ']')
      .then(() => {
        this.drugAccountService.remove(p.id)
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
    if (this.drugAccountName) {
      let promise;
      if (this.isUpdate) {
        promise = this.drugAccountService.update(this.drugAccountId, this.drugAccountName);
      } else {
        promise = this.drugAccountService.save(this.drugAccountName);
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
