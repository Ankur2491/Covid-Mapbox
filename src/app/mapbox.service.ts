import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountryDetails } from './models/country-details-model';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  constructor(private http: HttpClient) { }

  getWorldData(): Observable<any> {
    return this.http.get('http://http://35.224.154.91:5630/worldData');
  }

  getHistoricalData(country: string): Observable<any> {
    return this.http.get(`http://35.224.154.91:5630/historicalData/${country}`);
  }

  getCountryDetails(country: string): Observable<any> {
    return this.http.get(`http://35.224.154.91:5630/countryData/${country}`);
  }
}