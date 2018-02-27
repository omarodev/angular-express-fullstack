import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutocompleteModule } from 'ng2-input-autocomplete';

import { BreadcrumbBarComponent } from './breadcrumbbar/breadcrumbbar.component';
import { ProfileComponent } from './profile.component';
import { CommonCmpModule } from '../common/common.module';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { ProfileInfoBarComponent } from './profileInfobar/profileinfobar.component';
import { MultiKeywordSelectComponent } from './multikeywordselect/multikeywordselect.component';
import { ContactAssociationComponent } from './contactassociation/contactassociation.component';
import { CustomDonutChartComponent } from './customdonutchart/customdonutchart.component';
import { CardsComponent } from './cards/cards.component';
import { LifeTimeStatusComponent } from './cards/lifetimestatus/lifetimestatus.component';
import { CustomerDealsComponent } from './cards/customerdeals/customerdeals.component';
import { UpcomingAppointmentsComponent } from './cards/upcomingappointments/upcomingappointments.component';
import { TasksComponent } from './cards/tasks/tasks.component';
import { DocumentsComponent } from './cards/documents/documents.component';
import { CollaboratorsComponent } from './cards/collaborators/collaborators.component';

import { TabModule } from 'angular-tabs-component';
import { Ng2TimelineComponent } from './ng2-timeline/ng2timeline.component';
import { GetDate } from './ng2-timeline/getDate.pipe';
import { GetDateStatus } from './ng2-timeline/getDateStatus.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BreadcrumbBarComponent,
    ProfileComponent,
    ProfileInfoBarComponent,
    MultiKeywordSelectComponent,
    ContactAssociationComponent,
    CustomDonutChartComponent,
    Ng2TimelineComponent,
    CardsComponent,
    LifeTimeStatusComponent,
    CustomerDealsComponent,
    UpcomingAppointmentsComponent,
    TasksComponent,
    DocumentsComponent,
    CollaboratorsComponent,
    GetDate,
    GetDateStatus,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BreadcrumbModule,
    CommonCmpModule,
    TabModule,
    AutocompleteModule,
    FormsModule
  ],
  exports: [
    BreadcrumbBarComponent,
    ProfileComponent,
    ProfileInfoBarComponent,
    MultiKeywordSelectComponent,
    ContactAssociationComponent,
    CustomDonutChartComponent,
    Ng2TimelineComponent,
  ]
})
export class ProfileCmpModule { }