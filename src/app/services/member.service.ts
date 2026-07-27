import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Member, CreateMemberDto, UpdateMemberDto  } from '../models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/members/`;

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(this.url);
  }

  getById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.url}${id}`);
  }

  create(dto: CreateMemberDto): Observable<Member> {
    return this.http.post<Member>(this.url, dto);
  }

  update(id: string, dto: UpdateMemberDto ): Observable<Member> {
    return this.http.put<Member>(`${this.url}${id}`, dto);
  }
}
