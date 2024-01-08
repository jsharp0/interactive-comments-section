import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { map } from 'rxjs';
import { ResponseData } from '../interfaces/response-data.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'assets/data.json';

  constructor(private readonly http: HttpClient) {}

  getCurrentUser() {
    return this.http
      .get<ResponseData>(this.url)
      .pipe(map((res) => res.currentUser));
  }
}
