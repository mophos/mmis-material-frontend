import { GenericGroupEDService } from './generic-group-ed.service';
import { ProductGroupsService } from './product-groups.service';
import { UsersService } from './users.service';
import '@clr/icons';
import '@clr/icons/shapes/all-shapes';

import { UploadingService } from './../uploading.service';
import { MmComponentsModule } from './../mm-components/mm-components.module';
import { UnitsModule } from './units/units.module';
import { MappingComponent } from './mapping/mapping.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { Ag2CompleterModule } from 'ag2-completer';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { AgmCoreModule } from '@agm/core';

import { ClarityModule } from '@clr/angular';
import { LabelerService } from './labeler.service';
import { PackageService } from './package.service';
import { StandardService } from './standard.service';
import { GenericService } from './generic.service';
import { GenericDrugAccountsService } from './generic-drug-accounts.service';
import { GenericSuppliesService } from './generic-supplies.service';
import { GenericDrugTypesService } from './generic-drug-types.service';
import { GenericDrugDosagesService } from './generic-drug-dosages.service';
import { GenericDrugGroupsService } from './generic-drug-groups.service';
import { GenericSuppliesTypesService } from './generic-supplies-types.service';
import { GenericTypesProductService } from './generic-type-product.service';
import { ProductService } from './product.service';
import { AlertService } from './alert.service';
import { HelperService } from './helper.service';

import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth-guard.service';
import { LabelerPageComponent } from './labeler-page/labeler-page.component';
import { PackagesComponent } from './packages/packages.component';
import { GenericDrugTypesComponent } from './generic-drug-types/generic-drug-types.component';
import { GenericSuppliesTypesComponent } from './generic-supplies-types/generic-supplies-types.component';
import { GenericDrugGroupsComponent } from './generic-drug-groups/generic-drug-groups.component';
import { GenericDrugDosagesComponent } from './generic-drug-dosages/generic-drug-dosages.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { NumberOnlyDirective } from './number-only.directive';
import { GenericDrugAccountsComponent } from './generic-drug-accounts/generic-drug-accounts.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { GenericsComponent } from './generics/generics.component';
import { GenericsEditComponent } from './generics-edit/generics-edit.component';
import { NumberOnly5Directive } from '../helper/number-only-5.directive';
import { NumberOnly13Directive } from '../helper/number-only-13.directive';
import { LoadingModule } from 'app/loading/loading.module';
import { GenericTypeProductComponent } from './generic-type-product/generic-type-product.component';
import { UpperCaseDirective } from './upper-case.directive';
import { LabelerNewComponent } from './labeler-new/labeler-new.component';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { GenericGroupEdComponent } from './generic-group-ed/generic-group-ed.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { GenericMinmaxGroupsComponent } from './generic-minmax-groups/generic-minmax-groups.component';
import { GenericMinmaxGroupsService } from "./generic-minmax-groups.service";
import { ExportComponent } from './export/export.component';
import { GenericSetPlanningComponent } from './generic-planning/generic-planning.component';
import { GenericPlanningEditComponent } from './generic-planning-edit/generic-planning-edit.component';
@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule,
    UnitsModule,
    TextMaskModule,
    Ag2CompleterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCqW0ow8YCVZ5b4KydGqawkE5QeuWf7rDM',
      libraries: ['places']
    }),
    MmComponentsModule,
    LoadingModule,
    AdminRoutingModule,
    NgxGalleryModule
  ],
  declarations: [
    AdminComponent,
    LabelerPageComponent,
    PackagesComponent,
    GenericDrugTypesComponent,
    GenericSuppliesTypesComponent,
    GenericDrugGroupsComponent,
    GenericDrugDosagesComponent,
    ProductPageComponent,
    NumberOnlyDirective,
    MappingComponent,
    GenericDrugAccountsComponent,
    ProductEditComponent,
    WarehousesComponent,
    GenericsComponent,
    GenericsEditComponent,
    NumberOnly5Directive,
    NumberOnly13Directive,
    GenericTypeProductComponent,
    UpperCaseDirective,
    LabelerNewComponent,
    ProductGroupsComponent,
    GenericGroupEdComponent,
    GenericMinmaxGroupsComponent,
    ExportComponent,
    GenericSetPlanningComponent,
    GenericPlanningEditComponent
  ],
  providers: [
    LabelerService,
    PackageService,
    StandardService,
    GenericService,
    GenericSuppliesService,
    GenericDrugTypesService,
    GenericDrugDosagesService,
    GenericDrugGroupsService,
    GenericSuppliesTypesService,
    GenericDrugAccountsService,
    GenericTypesProductService,
    ProductService,
    AlertService,
    HelperService,
    AuthGuard,
    UploadingService,
    UsersService,
    ProductGroupsService,
    GenericGroupEDService,
    GenericMinmaxGroupsService
  ]
})
export class AdminModule { }
