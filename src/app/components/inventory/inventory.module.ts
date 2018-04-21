import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabModule } from 'angular-tabs-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatButtonToggleModule, MatCheckboxModule } from '@angular/material';
import { DragulaModule } from 'ng2-dragula';

import { ProfileCmpModule } from '../profile/profile.module';
import { CommonCmpModule } from '../common/common.module';
import { ProductsComponent } from './products/products.component';
import { PurchaseOrderListComponent } from './purchaseorderlist/purchaseorderlist.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { InventoryDashboardComponent } from './inventorydashboard/inventorydashboard.component';
import { ProductsCmpModule } from './products/products.module';
import { PurchaseOrderListCmpModule } from './purchaseorderlist/purchaseorderlist.module';
import { SuppliersCmpModule } from './suppliers/suppliers.module';
import { SupplierProfileCmpModule } from './supplierprofile/supplierprofile.module';

import { InventoryService } from './inventory.service';
import { Ng2CompleterModule } from 'ng2-completer';
import { AutocompleteModule } from 'ng2-input-autocomplete';


@NgModule({
  declarations: [
    PurchaseOrderListComponent,
    ProductsComponent,
    SuppliersComponent,
    InventoryDashboardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    TabModule,
    FormsModule,
    IonRangeSliderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    ProfileCmpModule,
    CommonCmpModule,
    Ng2CompleterModule,
    AutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    ProductsCmpModule,
    PurchaseOrderListCmpModule,
    SuppliersCmpModule,
    DragulaModule,
    SupplierProfileCmpModule
  ],
  exports: [
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
  ],
  providers: [InventoryService]
})
export class InventoryCmpModule { }
