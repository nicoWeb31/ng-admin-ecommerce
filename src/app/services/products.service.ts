import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = `${environment.api}products?API_KEY=${environment.api_key}`;
  private baseUrl2 = `https://api-jstore.espero-soft.com/api/products?API_KEY=adsffsdfds6b-6727-46f4-8bee-2c6ce6293e41`;
  private baseUrlEdit = `https://api-jstore.espero-soft.com/api/updateProducts.php?API_KEY=adsffsdfds6b-6727-46f4-8bee-2c6ce6293e41`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Response> {
    return this.http.get<Response>(this.baseUrl2);
  }
  //
  addProduct(product: Product): Observable<Response> {
    let params = new FormData();
    params.append('name', product.name);
    params.append('description', product.description);
    params.append('price', product.price.toString());
    params.append('stock', product.stock.toString());
    params.append('category', product.Category.toString());
    params.append('image', product.image);

    return this.http.post<Response>(this.baseUrl2, params);
  }

  editProduct(product): Observable<Response> {
    const url = this.baseUrlEdit+this.constructionURLPArams(product);
    return this.http.get<Response>(url);
  }

  constructionURLPArams = (ob) => {
    let result = '';
    for (const property in ob) {
      result += `&${property}=${ob[property]}`;
    }
    return result;
  };
}
