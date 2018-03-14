import { GridDetailModule } from './../grid-detail/grid-detail.module';
import { FormsModule } from '@angular/forms';
import { UnitsService } from './units.service';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitsMainComponent } from './units-main/units-main.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule,
    FormsModule,
    GridDetailModule
  ],
  declarations: [UnitsMainComponent],
  providers: [UnitsService]
})
export class UnitsModule { }
