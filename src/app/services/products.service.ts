import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = `${environment.api}products?API_KEY=${environment.api_key}`;
  private baseUrl2 = `https://api-jstore.espero-soft.com/api/products?API_KEY=adsffsdfds6b-6727-46f4-8bee-2c6ce6293e41`;

  constructor(
    private http : HttpClient,
  ) { }


  getProducts():Observable<Response> {
    return this.http.get<Response>(this.baseUrl2)
  }
}
