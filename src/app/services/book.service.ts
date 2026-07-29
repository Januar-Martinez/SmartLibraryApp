import { Book, BookDto } from './../models/book.model';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/books/`;

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.url);
  }

  getById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.url}${id}`);
  }

  create(dto: BookDto): Observable<Book> {
    return this.http.post<Book>(this.url, dto);
  }

  update(id: string, dto: BookDto ): Observable<Book> {
    return this.http.put<Book>(`${this.url}${id}`, dto);
  }
}
