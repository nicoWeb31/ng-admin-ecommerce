import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrlUpdate = `https://api-jstore.espero-soft.com/api/uploadImage.php?API_KEY=adsffsdfds6b-6727-46f4-8bee-2c6ce6293e41`;
  private baseUrl2Delete = `https://api-jstore.espero-soft.com/api/deleteImage.php?API_KEY=adsffsdfds6b-6727-46f4-8bee-2c6ce6293e41`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    let formData = new FormData();
    formData.append('image', file);

    return this.http.post(this.baseUrlUpdate, formData,{
      reportProgress :true,
      observe:'events'
    })
  }

  deleteImage(name: string): Observable<any> {
    let formData : any = new FormData();
    formData.append('name', name);

    return this.http.delete(this.baseUrl2Delete,formData)
  }
}
