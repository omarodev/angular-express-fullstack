import { Injectable, Output, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

@Injectable()

export class EstimatesService {

  constructor( private http: HttpClient ) {

  }

  getEstimates (): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates`;
    return this.http.get(url);
  }

  createEstimate (body): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates`;
    return this.http.post<any>(url, body);
  }

  getIndividualEstimate(id): Observable<any>  {
    const url = `${environment.apiUrl}/sales/estimates/${id}`;
    return this.http.get(url);
  }

  deleteIndividualEstimate(id): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates/${id}`;
    return this.http.delete(url);
  }

  updateEstimate (id, body): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates/${id}`;
    return this.http.put<any>(url, body);
  }

  getEstimatesProducts (id): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates/${id}/products`;
    return this.http.get(url);
  }

  createEstimateProduct (id, body): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates/${id}/products`;
    return this.http.post<any>(url, body);
  }

  getIndividualEstimateProducts(id, productId): Observable<any>  {
    const url = `${environment.apiUrl}/sale/estimates/${id}/products/${productId}`;
    return this.http.get(url);
  }

  updateEstimateProduct (id, productId, body): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates/${id}/products/${productId}`;
    return this.http.put<any>(url, body);
  }

  deleteEstimateProduct (id, productId): Observable<any> {
    const url = `${environment.apiUrl}/sales/estimates/${id}/products/${productId}`;
    return this.http.delete<any>(url);
  }

  sendEmail(estimateId) {
    const url = `${environment.apiUrl}/sales/estimates/${estimateId}/email`;
    return this.http.get<any>(url);
  }
  convertEstimateToInvoice(id): Observable<any>  {
    const url = `${environment.apiUrl}/sales/estimates/${id}/invoice-convert`;
    return this.http.get(url);
  }
}
