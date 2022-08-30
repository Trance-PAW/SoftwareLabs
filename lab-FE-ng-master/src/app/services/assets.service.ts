import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor(private http: HttpClient) { }

  getAssetAsBlob(path: string) {
    return new Promise((resolve) => {
      this.http.get(`/assets/${path}`, { responseType: 'blob' })
        .subscribe(res => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
          reader.readAsDataURL(res);
        });
    });
  }
}
