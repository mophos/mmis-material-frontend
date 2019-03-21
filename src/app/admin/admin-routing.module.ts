import { GenericGroupEdComponent } from './generic-group-ed/generic-group-ed.component';
import { ProductGroupsComponent } from './product-groups/product-groups.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { UnitsMainComponent } from './units/units-main/units-main.component';
import { GenericDrugAccountsComponent } from './generic-drug-accounts/generic-drug-accounts.component';
import { MappingComponent } from './mapping/mapping.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { LabelerPageComponent } from './labeler-page/labeler-page.component';
import { PackagesComponent } from './packages/packages.component';
import { GenericSuppliesTypesComponent } from './generic-supplies-types/generic-supplies-types.component';
import { GenericDrugGroupsComponent } from './generic-drug-groups/generic-drug-groups.component';
import { GenericDrugTypesComponent } from './generic-drug-types/generic-drug-types.component';
import { GenericTypeProductComponent } from './generic-type-product/generic-type-product.component';
import { GenericDrugDosagesComponent } from './generic-drug-dosages/generic-drug-dosages.component';
import { ProductPageComponent } from './product-page/product-page.component';
// import { ShippingNetworkComponent } from './shipping-network/shipping-network.component';

import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AuthGuard } from '../auth-guard.service';
import { GenericsComponent } from 'app/admin/generics/generics.component';
import { GenericsEditComponent } from 'app/admin/generics-edit/generics-edit.component';
import { LabelerNewComponent } from './labeler-new/labeler-new.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'labeler', component: LabelerPageComponent, pathMatch: 'full' },
      { path: 'labeler/new', component: LabelerNewComponent, pathMatch: 'full' },
      { path: 'labeler/edit', component: LabelerNewComponent, pathMatch: 'full' },
      { path: 'generics', component: GenericsComponent, pathMatch: 'full' },
      { path: 'generics/edit/:genericId', component: GenericsEditComponent, pathMatch: 'full' },
      { path: 'generic-types', component: GenericDrugTypesComponent, pathMatch: 'full' },
      { path: 'generic-type-product', component: GenericTypeProductComponent, pathMatch: 'full' },
      { path: 'generic-accounts', component: GenericDrugAccountsComponent, pathMatch: 'full' },
      { path: 'generic-dosages', component: GenericDrugDosagesComponent, pathMatch: 'full' },
      { path: 'generic-groups', component: GenericDrugGroupsComponent, pathMatch: 'full' },
      { path: 'generic-group-ed', component: GenericGroupEdComponent, pathMatch: 'full' },
      { path: 'generic-supplier-types', component: GenericSuppliesTypesComponent, pathMatch: 'full' },
      { path: 'products', component: ProductPageComponent, pathMatch: 'full' },
      { path: 'product-groups', component: ProductGroupsComponent, pathMatch: 'full' },
      { path: 'products/:productId', component: ProductEditComponent, pathMatch: 'full' },
      { path: 'packages', component: PackagesComponent, pathMatch: 'full' },
      { path: 'units', component: UnitsMainComponent, pathMatch: 'full' },
      { path: 'mapping', component: MappingComponent, pathMatch: 'full' },
      // { path: 'shipping-network', component: ShippingNetworkComponent, pathMatch: 'full' },
      { path: 'warehouses', component: WarehousesComponent, pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }
