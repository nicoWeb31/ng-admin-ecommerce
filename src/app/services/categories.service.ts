import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseUrl2 = `https://api-jstore.espero-soft.com/api/category?API_KEY=adsffsdfds6b-6727-46f4-8bee-2c6ce6293e41`;

  constructor(
    private http: HttpClient,
  ) { }

getCategory():Observable<Response> {
  return this.http.get<Response>(this.baseUrl2);
}

}
