import { Injectable, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

// helpers
import { apiHeaders, apiUrl } from '../config';

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

  getIndividualProject(id): Observable<any>  {
    const url = `${environment.apiUrl}/project-management/projects/${id}`;
    return this.http.get(url);
  }

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
    const url = `${apiUrl}inventory/suppliers/${id}/change-logs/${logId}`;
    return this.http.put(url, body);
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
    const url = `${apiUrl}inventory/suppliers/${id}/work-orders/${orderId}`;
    return this.http.put(url, body);
  }

}