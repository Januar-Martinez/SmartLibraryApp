import { Loan, CreateLoanDto } from './../models/loan.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/loan/`;

  getAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.url);
  }

  getById(id: string): Observable<Loan> {
    return this.http.get<Loan>(`${this.url}${id}`);
  }

  create(dto: CreateLoanDto): Observable<Loan> {
    return this.http.post<Loan>(this.url, dto);
  }

  returnLoan(id: string): Observable<Loan> {
    return this.http.put<Loan>(`${this.url}${id}`, {});
  }
}
