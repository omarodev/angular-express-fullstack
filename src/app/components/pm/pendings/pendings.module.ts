import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabModule } from 'angular-tabs-component';
import { FormsModule } from '@angular/forms';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProfileCmpModule } from '../../profile/profile.module';
import { CommonCmpModule } from '../../common/common.module';
import { PendingProjectCmpModule } from './pendingproject/pendingproject.module';

import { FilterService } from './filter.service';
import { PendingsListTableComponent } from './pendingslisttable/pendingslisttable.component';
import { PendingFilterComponent } from './pendingfilter/pendingfilter.component';
import { Ng2CompleterModule } from 'ng2-completer';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PendingsListTableComponent,
    PendingFilterComponent,
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
    NgSelectModule,
    PendingProjectCmpModule
  ],
  exports: [
    PendingsListTableComponent,
    PendingFilterComponent,
  ],
  providers: [FilterService]
})
export class PendingsCmpModule { }
