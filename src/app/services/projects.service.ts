import { Injectable, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

// helpers
import { apiHeaders } from '../config';

// rxjs
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
@Injectable()

export class ProjectsService {

  options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), method: 'POST' };

  constructor( private http: HttpClient) {
  }

  getProjectsList (): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects`;
    return this.http.get(url);
  }

  updateIndividualProject(id, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}`;
    return this.http.put(url, body);
  }

  getIndividualProject(id): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}`;
    return this.http.get(url);
  }

// Financials start

  getProjectCostSummary (id): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/cost-summaries`;
    return this.http.get(url);
  }

  createProjectCostSummary (id, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/cost-summaries`;
    return this.http.post(url, body, this.options)
      .map((res) => res);
  }

  deleteIndividualProjectCostSummary(id, summaryId): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}/cost-summaries/${summaryId}`;
    return this.http.delete(url);
  }

  getProjectIndividualCostSummary (id, summaryId): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/cost-summaries/${summaryId}`;
    return this.http.get(url);
  }

  getProjectBudget (id): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/budgets`;
    return this.http.get(url);
  }

  createProjectBudget (id, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/budgets`;
    return this.http.post(url, body, this.options)
      .map((res) => res);
  }

  deleteIndividualProjectBudget(id, budgetId): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}/budgets/${budgetId}`;
    return this.http.delete(url);
  }

  getProjectIndividualBudget (id, budgetId): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/budgets/${budgetId}`;
    return this.http.get(url);
  }

  getProjectPaymentSchedule (id): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/payment-schedules`;
    return this.http.get(url);
  }

  updateProjectPaymentSchedule (id, scheduleId, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/payment-schedules/${scheduleId}`;
    return this.http.put(url, body, this.options)
      .map((res) => res);
  }

  getProjectIndividualPaymentSchedule (id, scheduleId): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/payment-schedules/${scheduleId}`;
    return this.http.get(url);
  }

// financials end

  getProjectChangeLogs (id): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/change-logs`;
    return this.http.get(url);
  }

  getIndividualProjectChangeLog(id, logId): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}/change-logs/${logId}`;
    return this.http.get(url);
  }

  createProjectChangeLog (id, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/change-logs`;
    return this.http.post(url, body, this.options);
  }

  updateIndividualChangeLog(id, logId, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/change-logs/${logId}`;
    return this.http.put(url, body);
  }

  deleteIndividualChangeLog(id, logId): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/change-logs/${logId}`;
    return this.http.delete(url);
  }

  sendChangelogEmail(id, logId): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}/change-logs/${logId}/email`;
    return this.http.get(url);
  }

  getChangeLogItems(id, logId): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}/change-logs/${logId}/items`;
    return this.http.get(url);
  }

  getProjectWorkOrders (id): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/work-orders`;
    return this.http.get(url);
  }

  getIndividualProjectWorkOrder(id, orderId): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}/work-orders/${orderId}`;
    return this.http.get(url);
  }

  createProjectWorkOrder (id, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/work-orders`;
    return this.http.post(url, body, this.options);
  }

  updateIndividualWorkOrder (id, orderId, body): Observable<any> {
    const url = `${environment.apiUrl}/inventory/suppliers/${id}/work-orders/${orderId}`;
    return this.http.put(url, body);
  }

  createProjectProduct (id, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/products`;
    return this.http.post(url, body, this.options);
  }

  updateIndividualProjectProduct (id, productId, body): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/products/${productId}`;
    return this.http.put(url, body);
  }

  deleteIndividualProjectProduct (id, productId): Observable<any> {
    const url = `${environment.apiUrl}/project-management/projects/${id}/products/${productId}`;
    return this.http.delete(url);
  }
}
