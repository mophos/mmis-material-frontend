import { GenericPlanningService } from './generic-planning.service';
import { ToThaiDatePipe } from './../to-thai-date.pipe';
import { DateService } from './../admin/date.service';
import { LotService } from './lot.service';
import { LotsComponent } from './lots/lots.component';
import { OrderModifierService } from './order-modifier.service';
import { ProductPlanningService } from './product-planning.service';
import { TextMaskModule } from 'angular2-text-mask';
import { Ag2CompleterModule } from 'ag2-completer';
import { UomService } from './uom.service';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ProductPlanningComponent } from './product-planning/product-planning.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UomComponent } from './uom/uom.component';
import { OrderModifiersComponent } from './order-modifiers/order-modifiers.component';
import { GenericPlanningComponent } from './generic-planning/generic-planning.component';
import { LoadingComponent } from 'app/loading/loading.component';
import { LoadingModule } from 'app/loading/loading.module';
import { SearchGenericsBoxComponent } from './search-generics-box/search-generics-box.component';
import { AgxTypeaheadModule } from '@siteslave/agx-typeahead';
import { SearchLabelerBoxComponent } from 'app/mm-components/search-labeler-box/search-labeler-box.component';
import { ReceivePlanningComponent } from './receive-planning/receive-planning.component';
import { ReceivePlanningService } from './receive-planning.service';
import { MappingsComponent } from './mappings/mappings.component';
import { MappingsService } from './mappings.service';
import { SearchTmtCodeComponent } from './search-tmt-code/search-tmt-code.component';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    AgxTypeaheadModule,
    FormsModule,
    Ag2CompleterModule,
    TextMaskModule,
    LoadingModule
  ],
  providers: [
    UomService,
    ProductPlanningService,
    ReceivePlanningService,
    OrderModifierService,
    LotService,
    DateService,
    GenericPlanningService,
    MappingsService
  ],
  declarations: [
    ToThaiDatePipe,
    ProductPlanningComponent,
    UomComponent,
    OrderModifiersComponent,
    LotsComponent,
    GenericPlanningComponent,
    SearchGenericsBoxComponent,
    SearchLabelerBoxComponent,
    ReceivePlanningComponent,
    MappingsComponent,
    SearchTmtCodeComponent
  ],
  exports: [
    ProductPlanningComponent,
    UomComponent,
    OrderModifiersComponent,
    LotsComponent,
    GenericPlanningComponent,
    ReceivePlanningComponent,
    SearchGenericsBoxComponent,
    SearchLabelerBoxComponent,
    MappingsComponent,
    SearchTmtCodeComponent
  ]
})
export class MmComponentsModule { }
