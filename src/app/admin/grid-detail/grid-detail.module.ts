import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitEditorComponent } from './unit-editor/unit-editor.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule
  ],
  declarations: [UnitEditorComponent],
  exports: [UnitEditorComponent]
})
export class GridDetailModule { }
